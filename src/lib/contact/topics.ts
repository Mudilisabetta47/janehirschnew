/** Themen des Anfrageformulars. `value` wird auch per URL (?thema=…) vorbelegt. */
export const topics = [
  { value: "erstgespraech", label: "Kostenloses Erstgespräch", salon: false },
  { value: "einzelcoaching", label: "Einzelcoaching", salon: false },
  { value: "gruppencoaching", label: "Gruppencoaching", salon: false },
  { value: "saloncoaching", label: "Saloncoaching", salon: true },
  { value: "watch-and-learn", label: "Watch & Learn", salon: true },
  { value: "braut-make-up-coaching", label: "Braut-Make-up-Coaching", salon: false },
  { value: "online-coaching", label: "Online-Coaching", salon: false },
  { value: "sonstiges", label: "Allgemeine Frage", salon: false },
] as const;

export type TopicValue = (typeof topics)[number]["value"];
export const topicValues = topics.map((t) => t.value) as [TopicValue, ...TopicValue[]];

export const topicLabel = (value: string) => topics.find((t) => t.value === value)?.label ?? "Allgemeine Frage";

export const isTopic = (value: string | null | undefined): value is TopicValue =>
  !!value && topics.some((t) => t.value === value);
