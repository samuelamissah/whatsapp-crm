import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspace } from "@/lib/workspace";

export const POST = withRateLimit(async (request: Request) => {
  const supabase = await createSupabaseServerClient();

  const { workspace, error: workspaceError } = await getCurrentWorkspace();

  if (workspaceError || !workspace) {
    return NextResponse.json(
      { error: workspaceError || "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const tags = Array.isArray(body.tags) ? body.tags : [];

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      workspace_id: workspace.id,
      name,
      phone,
      tags,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customer: data }, { status: 201 });
});