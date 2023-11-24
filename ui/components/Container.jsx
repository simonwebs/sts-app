import React, { forwardRef } from 'react';
import clsx from 'clsx';

const OuterContainer = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
    <div className="mx-auto w-full max-w-7xl lg:px-8">{children}</div>
  </div>
));

const InnerContainer = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
    {...props}
  >
    <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
  </div>
));

const Container = forwardRef(({ children, ...props }, ref) => (
  <OuterContainer ref={ref} {...props}>
    <InnerContainer>{children}</InnerContainer>
  </OuterContainer>
));

Container.Outer = OuterContainer;
Container.Inner = InnerContainer;
export default Container;
