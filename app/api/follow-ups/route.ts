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

  const customerId = String(body.customerId || "").trim();
  const title = String(body.title || "").trim();
  const note = String(body.note || "").trim();
  const remindAt = String(body.remindAt || "").trim();

  if (!customerId || !title || !remindAt) {
    return NextResponse.json(
      { error: "Customer, title and reminder date are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("follow_ups")
    .insert({
      workspace_id: workspace.id,
      customer_id: customerId,
      title,
      note,
      remind_at: remindAt,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("customer_timeline").insert({
    workspace_id: workspace.id,
    customer_id: customerId,
    type: "follow_up_created",
    title: "Follow-up created",
    description: title,
    metadata: {
      note,
      remind_at: remindAt,
    },
  });

  return NextResponse.json({ followUp: data }, { status: 201 });
}