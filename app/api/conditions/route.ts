import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing latitude or longitude." },
      { status: 400 }
    );
  }

  try {
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}` +
      `&longitude=${lon}` +
      `&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,sea_surface_temperature` +
      `&forecast_days=1` +
      `&timezone=auto`;

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
      `&longitude=${lon}` +
      `&hourly=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,weather_code` +
      `&forecast_days=1` +
      `&timezone=auto`;

    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: 900 } }),
      fetch(weatherUrl, { next: { revalidate: 900 } }),
    ]);

    if (!marineRes.ok || !weatherRes.ok) {
      return NextResponse.json(
        { error: "Could not fetch marine or weather data." },
        { status: 500 }
      );
    }

    const marineData = await marineRes.json();
    const weatherData = await weatherRes.json();

    const marineHourly = marineData.hourly;
    const weatherHourly = weatherData.hourly;

    const hourly = (weatherHourly?.time || []).slice(0, 24).map(
      (time: string, index: number) => ({
        time,
        temperature: weatherHourly?.temperature_2m?.[index] ?? null,
        precipitation: weatherHourly?.precipitation?.[index] ?? null,
        windSpeed: weatherHourly?.wind_speed_10m?.[index] ?? null,
        windDirection: weatherHourly?.wind_direction_10m?.[index] ?? null,
        windGusts: weatherHourly?.wind_gusts_10m?.[index] ?? null,
        visibility: weatherHourly?.visibility?.[index] ?? null,
        weatherCode: weatherHourly?.weather_code?.[index] ?? null,

        waveHeight: marineHourly?.wave_height?.[index] ?? null,
        waveDirection: marineHourly?.wave_direction?.[index] ?? null,
        wavePeriod: marineHourly?.wave_period?.[index] ?? null,
        swellHeight: marineHourly?.swell_wave_height?.[index] ?? null,
        swellPeriod: marineHourly?.swell_wave_period?.[index] ?? null,
        seaTemp: marineHourly?.sea_surface_temperature?.[index] ?? null,
      })
    );

    const now = new Date();
    const current =
      hourly.find(
        (item: { time: string }) =>
          new Date(item.time).getHours() === now.getHours()
      ) ||
      hourly[0] ||
      null;

    return NextResponse.json({
      provider: "Open-Meteo",
      latitude: Number(lat),
      longitude: Number(lon),
      current,
      hourly,
    });
  } catch {
    return NextResponse.json(
      { error: "Conditions request failed." },
      { status: 500 }
    );
  }
}