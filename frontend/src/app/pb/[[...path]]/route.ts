import { NextRequest, NextResponse } from 'next/server'

// Proxy all /pb/* requests to the PocketBase backend
// This is needed because rewrites don't work in standalone mode
export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  const backendUrl = process.env.POCKETBASE_URL || 'http://hoa-backend:8090'
  const path = params.path?.join('/') || ''
  const url = `${backendUrl}/${path}${request.nextUrl.search}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // Forward relevant headers
        ...(request.headers.get('range') && { Range: request.headers.get('range')! }),
      },
    })

    // Get the response body
    const body = await response.arrayBuffer()

    // Create response with appropriate headers
    return new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Length': response.headers.get('Content-Length') || String(body.byteLength),
        'Cache-Control': response.headers.get('Cache-Control') || 'public, max-age=3600',
        ...(response.headers.get('Content-Disposition') && {
          'Content-Disposition': response.headers.get('Content-Disposition')!,
        }),
        ...(response.headers.get('Accept-Ranges') && {
          'Accept-Ranges': response.headers.get('Accept-Ranges')!,
        }),
      },
    })
  } catch (error) {
    console.error('Error proxying to PocketBase:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 502 }
    )
  }
}

// Support POST for API calls
export async function POST(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  const backendUrl = process.env.POCKETBASE_URL || 'http://hoa-backend:8090'
  const path = params.path?.join('/') || ''
  const url = `${backendUrl}/${path}${request.nextUrl.search}`

  try {
    const body = await request.arrayBuffer()

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
      body,
    })

    const responseBody = await response.arrayBuffer()

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('Error proxying to PocketBase:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 502 }
    )
  }
}
