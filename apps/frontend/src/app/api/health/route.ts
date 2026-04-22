import { NextResponse } from 'next/server';

// ── Self-diagnostic / "Doctor" endpoint ──────────────────────
// GET /api/health  →  returns system status, latency, checks

interface HealthCheck {
  name: string;
  status: 'ok' | 'warn' | 'error';
  latencyMs?: number;
  detail?: string;
}

interface HealthReport {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  version: string;
  checks: HealthCheck[];
}

export async function GET() {
  const start = Date.now();
  const checks: HealthCheck[] = [];

  // 1. Runtime check
  checks.push({
    name: 'runtime',
    status: 'ok',
    detail: `Node ${process.version}`,
    latencyMs: 0,
  });

  // 2. Memory check
  const mem = process.memoryUsage();
  const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024);
  const heapPct = Math.round((mem.heapUsed / mem.heapTotal) * 100);
  checks.push({
    name: 'memory',
    status: heapPct > 90 ? 'error' : heapPct > 75 ? 'warn' : 'ok',
    detail: `${heapUsedMb}MB / ${heapTotalMb}MB (${heapPct}%)`,
    latencyMs: Date.now() - start,
  });

  // 3. Environment check
  const requiredEnvs = ['NODE_ENV'];
  const missingEnvs = requiredEnvs.filter(k => !process.env[k]);
  checks.push({
    name: 'environment',
    status: missingEnvs.length > 0 ? 'warn' : 'ok',
    detail: missingEnvs.length > 0
      ? `Missing: ${missingEnvs.join(', ')}`
      : `NODE_ENV=${process.env.NODE_ENV}`,
  });

  // 4. Response latency self-check
  const latency = Date.now() - start;
  checks.push({
    name: 'response-latency',
    status: latency > 2000 ? 'error' : latency > 500 ? 'warn' : 'ok',
    latencyMs: latency,
    detail: `${latency}ms`,
  });

  // Aggregate status
  const hasError = checks.some(c => c.status === 'error');
  const hasWarn  = checks.some(c => c.status === 'warn');
  const overallStatus: HealthReport['status'] = hasError
    ? 'down'
    : hasWarn
    ? 'degraded'
    : 'healthy';

  const report: HealthReport = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: process.env.npm_package_version ?? '0.1.0',
    checks,
  };

  const httpStatus = overallStatus === 'down' ? 503 : 200;

  return NextResponse.json(report, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store',
      'X-Health-Status': overallStatus,
    },
  });
}
