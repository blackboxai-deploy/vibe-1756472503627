export async function GET() {
  return Response.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AI Image Generation API'
    },
    { status: 200 }
  );
}