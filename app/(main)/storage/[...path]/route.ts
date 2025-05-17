import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	// дождёмся разрешения params
	const { path } = await params
	const joined = path.join('/')
	
	const backendUrl =
		`${process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')}` +
		`/storage/${joined}`
	
	const res = await fetch(backendUrl)
	if (!res.ok) {
		return new NextResponse('Not found', { status: res.status })
	}
	
	const contentType = res.headers.get('content-type') ?? undefined
	const cacheControl = res.headers.get('cache-control') ?? 'public, max-age=86400'
	const buf = await res.arrayBuffer()
	
	// собираем заголовки без undefined
	const headers: Record<string, string> = { 'Cache-Control': cacheControl }
	if (contentType) headers['Content-Type'] = contentType
	
	return new NextResponse(buf, { status: 200, headers })
}

