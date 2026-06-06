import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { workspace, user } = await getCurrentWorkspace();

  if (!user || !workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const notes = String(body.notes || "").trim();
  const tags = Array.isArray(body.tags)
    ? body.tags.map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  const loyaltyStatus = String(body.loyalty_status || "regular");

  const allowedStatuses = ["new", "regular", "vip", "wholesale", "slow_payer"];

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 }
    );
  }

  if (!allowedStatuses.includes(loyaltyStatus)) {
    return NextResponse.json(
      { error: "Invalid loyalty status" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("customers")
    .update({
      name,
      phone,
      notes,
      tags,
      loyalty_status: loyaltyStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customer: data });
}