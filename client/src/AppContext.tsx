import React, { FunctionComponent } from "react";

interface IAppContext {
  deck: string[];
}

export const AppContext = React.createContext<IAppContext>({ deck: ["0", "1", "2", "3", "4", "5"] });
