import React, { forwardRef } from "react";
import css from './DefaultInput.module.css'

const DefaultInput = forwardRef(({ customClass, ...props }, ref) => {
  const combinedClasses = customClass ? `${css.defaultInput} ${css[customClass]}` : css.defaultInput;
  const inputProps = {
    ...props,
    className: combinedClasses,
  };

  if (ref) {
    inputProps.ref = ref;
  }

  return <input {...inputProps} />;
});
export default DefaultInput;