import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getCurrentWorkspace } from "@/lib/workspace";

const allowedStatuses = ["pending", "paid", "delivered", "cancelled"];

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

  const customerId = String(body.customerId || "").trim();
  const item = String(body.item || "").trim();
  const amount = Number(body.amount);
  const status = String(body.status || "pending").toLowerCase();

  if (!customerId || !item || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "Customer, item and valid amount are required" },
      { status: 400 }
    );
  }

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid order status" },
      { status: 400 }
    );
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("id", customerId)
    .eq("workspace_id", workspace.id)
    .maybeSingle();

  if (!customer) {
    return NextResponse.json(
      { error: "Customer not found in this workspace" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      workspace_id: workspace.id,
      customer_id: customerId,
      item,
      amount,
      status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data }, { status: 201 });
});

export const PATCH = withRateLimit(async (request: Request) => {
  const supabase = await createSupabaseServerClient();
  const { workspace, error: workspaceError } = await getCurrentWorkspace();

  if (workspaceError || !workspace) {
    return NextResponse.json(
      { error: workspaceError || "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const id = String(body.id || "").trim();
  const status = String(body.status || "").toLowerCase();

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  // Ensure the order belongs to the workspace before updating
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .maybeSingle();

  if (orderError || !orderData) {
    return NextResponse.json(
      { error: "Order not found in this workspace" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
});