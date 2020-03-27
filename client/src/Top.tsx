import React, { FunctionComponent, useState } from "react";

type TopProps = {
  message: string;
}

export const Top: FunctionComponent<TopProps> = (props: TopProps) => {
  return (
    <div>HELLO, {props.message} !</div>
  )
}