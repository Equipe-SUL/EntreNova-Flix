export type Message = {
  text: string;
  sender: "bot" | "user";
  opcoes?: string[];
};