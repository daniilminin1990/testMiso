export type JsonPrimative = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json | undefined };
export type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimative | JsonComposite;
