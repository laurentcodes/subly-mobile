import type { ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// types for the component props
type SafeAreaWrapperProps = {
  children: ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  className?: string;
  contentClassName?: string;
};

// inner component that uses the insets
const SafeAreaContent = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  className,
  contentClassName,
}: SafeAreaWrapperProps) => {
  const insets = useSafeAreaInsets();

  // dynamically calculate padding based on which edges are enabled
  const safePadding: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[styles.container, safePadding, style]} className={className}>
      {contentClassName ? (
        <View className={contentClassName} style={styles.content}>
          {children}
        </View>
      ) : (
        children
      )}
    </View>
  );
};

// main wrapper component that provides the safe area context
export const SafeAreaView = ({
  children,
  edges,
  style,
  className,
  contentClassName,
}: SafeAreaWrapperProps) => {
  return (
    <SafeAreaProvider>
      <SafeAreaContent
        edges={edges}
        style={style}
        className={className}
        contentClassName={contentClassName}
      >
        {children}
      </SafeAreaContent>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
