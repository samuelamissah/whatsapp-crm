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

  const phoneNumberId = String(body.phoneNumberId || "").trim();
  const businessAccountId = String(body.businessAccountId || "").trim();
  const accessToken = String(body.accessToken || "").trim();
  const webhookVerifyToken = String(body.webhookVerifyToken || "").trim();

  if (!phoneNumberId || !businessAccountId || !accessToken || !webhookVerifyToken) {
    return NextResponse.json(
      { error: "All WhatsApp API fields are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("whatsapp_settings")
    .upsert(
      {
        workspace_id: workspace.id,
        phone_number_id: phoneNumberId,
        business_account_id: businessAccountId,
        access_token: accessToken,
        webhook_verify_token: webhookVerifyToken,
        is_connected: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}