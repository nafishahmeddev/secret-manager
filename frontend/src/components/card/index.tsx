import React from 'react';
export default function Card({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl shadow bg-white ${className}`}
      {...props}
    >
      {props.children}
    </div>
  );

}