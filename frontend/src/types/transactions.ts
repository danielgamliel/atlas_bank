export type TxStatus = "completed" | "pending" | "failed";

export type TxItem = {
  id: string;
  title: string;
  subtitleText: string;
  date: string;
  amountText: string;
  direction: "in" | "out";
  status: TxStatus;
};
