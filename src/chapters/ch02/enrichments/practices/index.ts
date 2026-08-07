import { practice21PublicPrivate } from "./2-1-public-private";
import { practice24RandomK } from "./2-4-random-k";
import { practice25Axioms } from "./2-5-axioms";
import { practice26Growth } from "./2-6-growth";
import { practice27Collision } from "./2-7-collision";
import { practice29SmoothOrder } from "./2-9-smooth-order";
import { practice210FieldTest } from "./2-10-field-test";
import { practice22DiscreteLog } from "./2-2-discrete-log";
import { practice23DhSecret } from "./2-3-dh-secret";
import { practice28Crt } from "./2-8-crt";
import type { EnrichmentItem } from "../shared/types";

export { practice21PublicPrivate, practice24RandomK, practice25Axioms, practice26Growth, practice27Collision, practice29SmoothOrder, practice210FieldTest, practice22DiscreteLog, practice23DhSecret, practice28Crt };

export const practices: readonly EnrichmentItem[] = [
  practice21PublicPrivate,
  practice24RandomK,
  practice25Axioms,
  practice26Growth,
  practice27Collision,
  practice29SmoothOrder,
  practice210FieldTest,
  practice22DiscreteLog,
  practice23DhSecret,
  practice28Crt,
];
