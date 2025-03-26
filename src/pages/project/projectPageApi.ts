import axios from "axios";
import {
  ControlEventDto,
  EditControlEventCommand,
  type HttpValidationProblemDetails,
} from "../../shared/types/apiTypes";
import { apiRoutes } from "@shared/api/apiRoutes";

function isValidationProblem(
  data: unknown,
): data is HttpValidationProblemDetails {
  return (
    typeof data === "object" &&
    !!data &&
    "type" in data &&
    data.type === "https://tools.ietf.org/html/rfc9110#section-15.5.1"
  );
}

export const projectPageApi = {
  async createForm() {
    const response = await axios.post<string>(apiRoutes.createProject());
    return response.data;
  },

  async fetch(id: string) {
    const response = await axios.get<ControlEventDto>(apiRoutes.getProject(id));
    return response.data;
  },

  async updateForm(
    projectId: string,
    data: EditControlEventCommand,
  ): Promise<
    | { status: "ok" }
    | { status: "conflict" }
    | { status: "validation"; errorData: { [key: string]: string[] } }
    | { status: "error"; errorData: unknown }
  > {
    try {
      await axios.patch(apiRoutes.updateProject(projectId), data);
      return { status: "ok" };
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) return { status: "conflict" };
        if (isValidationProblem(error.response.data))
          return {
            status: "validation",
            errorData: error.response.data.errors ?? [],
          };
      }

      return { status: "error", errorData: error };
    }
  },
};
