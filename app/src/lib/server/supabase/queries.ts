import { validateDomain } from "$lib/utils/domain";
import type { Tables } from "$models/database.model";
import { supabase } from "./client";

export const getEvent = async ({ document_id }: Pick<Tables<"event">, "document_id">) => {
  const result = await supabase.from("event").select().eq("document_id", document_id).maybeSingle();
  return result;
};

export const getEventParticipant = async ({
  event_id,
  email,
}: Pick<Tables<"event_participant">, "event_id" | "email">) => {
  const result = await supabase
    .from("event_participant")
    .select("email, attending, event_id")
    .eq("event_id", event_id)
    .eq("email", email)
    .maybeSingle();

  return result;
};

export const updateEventParticipantAttending = async ({
  event_id,
  email,
}: Pick<Tables<"event_participant">, "event_id" | "email">) => {
  const result = await supabase
    .from("event_participant")
    .update({ attending: false })
    .eq("event_id", event_id)
    .eq("email", email);

  return result;
};

export const updateEventParticipant = async ({
  event_id,
  full_name,
  telephone,
  email,
  firm,
  attending,
}: Pick<
  Tables<"event_participant">,
  "event_id" | "full_name" | "telephone" | "email" | "firm" | "attending"
>) => {
  const result = await supabase
    .from("event_participant")
    .update({
      event_id,
      full_name,
      telephone,
      email,
      firm,
      attending,
    })
    .eq("event_id", event_id)
    .eq("email", email);

  return result;
};

export const saveEventParticipant = async ({
  event_id,
  full_name,
  telephone,
  email,
  firm,
}: Pick<
  Tables<"event_participant">,
  "event_id" | "full_name" | "telephone" | "email" | "firm"
>) => {
  const result = await supabase.from("event_participant").insert({
    event_id,
    full_name,
    telephone,
    email,
    firm,
  });

  return result;
};

export const saveEventParticipantAllergy = async () => {
  const result = await supabase
    .from("event_participant_allergy")
    .insert({})
    .select("event_participant_allergy_id")
    .maybeSingle();

  return result;
};

export const saveEventAllergyList = async (eventAllergy: Tables<"event_allergy">[]) => {
  const result = await supabase.from("event_allergy").insert(eventAllergy);
  return result;
};

export const getInternalEventParticipantNames = async ({
  document_id,
}: Pick<Tables<"event">, "document_id">) => {
  const result = await supabase
    .from("event")
    .select("event_participant(full_name, email)")
    .eq("document_id", document_id)
    .eq("event_participant.attending", true)
    .maybeSingle();

  return result.data?.event_participant
    .filter(({ email }) => validateDomain(email))
    .map(({ full_name }) => full_name);
};

export const getAttendingEvent = async ({
  email,
  document_id,
}: {
  email: Tables<"event_participant">["email"];
  document_id: Tables<"event">["document_id"];
}) => {
  const result = await supabase
    .from("event")
    .select("event_participant(attending)")
    .eq("document_id", document_id)
    .eq("event_participant.attending", true)
    .eq("event_participant.email", email)
    .maybeSingle();

  if (result.data?.event_participant.length) {
    return true;
  }
  return false;
};

export const getAllAttendingEvents = async ({
  email,
}: {
  email: Tables<"event_participant">["email"];
}) => {
  const result = await supabase
    .from("event_participant")
    .select("event(document_id)")
    .eq("attending", true)
    .eq("email", email);

  if (result.data?.length) {
    return result.data.map((item) => item.event?.document_id);
  }
  return [];
};
