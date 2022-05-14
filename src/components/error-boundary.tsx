import React from "react";

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

// 异常边界
// React.PropsWithChildren<{fallbackRender: FallbackRender} 指的是除了children，剩下的属性
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  any
> {
  state = { error: null };

  // 当ErrorBoundary的子组件发生了渲染错误以后，getDerivedStateFromError触发，将error赋值给state
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
