import { useQuery } from "react-query";
import { GetVersionApp } from "../api/Api";

export const useVersionApp = () => useQuery(["VersionApp"], () => GetVersionApp(), { enabled: false, retry: 0 });