import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { workspace, user } = await getCurrentWorkspace();

  if (!user || !workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const title = String(body.title || "").trim();
  const bodyText = String(body.body || "").trim();
  const category = String(body.category || "general").trim();

  if (!title || !bodyText) {
    return NextResponse.json(
      { error: "Title and message body are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("whatsapp_templates")
    .insert({
      workspace_id: workspace.id,
      title,
      body: bodyText,
      category,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ template: data }, { status: 201 });
}