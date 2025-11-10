import { useCallback, useMemo, useRef } from 'react';
import { Pressable, Text } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

import { useTheme, Button } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

export interface SelectItem<T = string> {
  label: string;
  value: T;
  [key: string]: any;
}

interface SelectProps<T = string> {
  items: SelectItem<T>[];
  value?: T;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  snapPoints?: string[] | number[];
  renderTrigger?: (
    selectedItem: SelectItem<T> | undefined,
    placeholder: string,
    onOpen: () => void,
  ) => React.ReactNode;
  renderItem?: (
    item: SelectItem<T>,
    isSelected: boolean,
    onSelect: () => void,
  ) => React.ReactNode;
  buttonTrigger?: boolean;
}

export const Select = <T = string>({
  items,
  value,
  onValueChange,
  placeholder = 'Select an item',
  snapPoints,
  renderTrigger,
  renderItem,
  buttonTrigger = false,
}: SelectProps<T>) => {
  // get theme colors
  const { colors } = useTheme();

  // ref for bottom sheet modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // calculate snap points - default to 50% of screen
  const calculatedSnapPoints = useMemo(
    () => snapPoints || ['50%'],
    [snapPoints],
  );

  // get selected item
  const selectedItem = useMemo(
    () => items.find((item) => item.value === value),
    [items, value],
  );

  // handle opening the bottom sheet
  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // handle item selection
  const handleSelectItem = useCallback(
    (item: SelectItem<T>) => {
      onValueChange?.(item.value);
      bottomSheetModalRef.current?.dismiss();
    },
    [onValueChange],
  );

  // render backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  // default trigger renderer
  const defaultTriggerRenderer = useCallback(
    (selected: SelectItem<T> | undefined, placeholderText: string) => {
      if (buttonTrigger) {
        return (
          <Button variant='tertiary' onPress={handleOpen}>
            <Button.Label>{selected?.label || placeholderText}</Button.Label>
          </Button>
        );
      }

      return (
        <Pressable
          onPress={handleOpen}
          className='px-4 py-3 bg-panel rounded-lg border border-border'
        >
          <Text className='text-foreground text-base'>
            {selected?.label || placeholderText}
          </Text>
        </Pressable>
      );
    },
    [handleOpen, buttonTrigger],
  );

  // default item renderer
  const defaultItemRenderer = useCallback(
    (item: SelectItem<T>, isSelected: boolean) => (
      <Pressable
        onPress={() => handleSelectItem(item)}
        className={`px-6 py-4 flex-row items-center justify-between ${
          isSelected ? 'bg-primary/10' : ''
        }`}
      >
        <Text
          style={{
            color: isSelected ? colors.accent : colors.foreground,
            fontWeight: isSelected ? 'bold' : 'normal',
          }}
        >
          {item.label}
        </Text>

        {isSelected && <Feather name='check' size={20} color={colors.accent} />}
      </Pressable>
    ),
    [handleSelectItem, colors.accent, colors.foreground],
  );

  return (
    <>
      {/* trigger */}
      {renderTrigger
        ? renderTrigger(selectedItem, placeholder, handleOpen)
        : defaultTriggerRenderer(selectedItem, placeholder)}

      {/* bottom sheet modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={calculatedSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.accent,
        }}
      >
        <BottomSheetFlatList
          data={items}
          keyExtractor={(item: any) => String(item.value)}
          renderItem={({ item }: { item: any }) => {
            const isSelected = item.value === value;
            const onSelect = () => handleSelectItem(item);
            return renderItem
              ? renderItem(item, isSelected, onSelect)
              : defaultItemRenderer(item, isSelected);
          }}
          contentContainerStyle={{
            backgroundColor: colors.background,
          }}
        />
      </BottomSheetModal>
    </>
  );
};
