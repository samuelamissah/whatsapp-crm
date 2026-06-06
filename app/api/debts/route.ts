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
  const description = String(body.description || "").trim();
  const amount = Number(body.amount);
  const amountPaid = Number(body.amountPaid || 0);
  const dueDate = body.dueDate || null;

  if (!customerId || !description || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "Customer, description and valid amount are required" },
      { status: 400 }
    );
  }

  if (amountPaid < 0 || amountPaid > amount) {
    return NextResponse.json(
      { error: "Amount paid cannot be more than total amount" },
      { status: 400 }
    );
  }

  const status =
    amountPaid === 0 ? "open" : amountPaid < amount ? "part_paid" : "paid";

  const { data, error } = await supabase
    .from("customer_debts")
    .insert({
      workspace_id: workspace.id,
      customer_id: customerId,
      description,
      amount,
      amount_paid: amountPaid,
      due_date: dueDate,
      status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("customer_timeline").insert({
    workspace_id: workspace.id,
    customer_id: customerId,
    type: "debt_created",
    title: "Debt recorded",
    description: `${description} - GHS ${amount}`,
    metadata: {
      amount,
      amount_paid: amountPaid,
      due_date: dueDate,
      status,
    },
  });

  return NextResponse.json({ debt: data }, { status: 201 });
}