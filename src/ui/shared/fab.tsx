import React from 'react';
import { View, Pressable, PressableProps } from 'react-native';

interface FabProps extends PressableProps {
  icon: JSX.Element;
}

export function Fab({ icon, style, ...props }: FabProps) {
  return (
    <View className="absolute bottom-4 right-4">
      <Pressable
        {...props}
        className="bg-green-700 rounded-full p-4"
        style={style}
      >
        {icon}
      </Pressable>
    </View>
  );
}
