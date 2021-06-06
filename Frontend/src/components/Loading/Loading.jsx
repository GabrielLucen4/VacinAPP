import React from 'react';
import ReactLoading from "react-loading";

export default function Loading() {
  const props = {
    prop: "spinningBubbles",
    name: "SpinningBubbles"
  }

  return (
    <ReactLoading type={props.prop} color="#fff"/>
  )
}