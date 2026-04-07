import { NextResponse } from 'next/server';
import { ROLES_SISTEMA } from '@lib/roles';

export async function GET() {
  return NextResponse.json(ROLES_SISTEMA);
}
