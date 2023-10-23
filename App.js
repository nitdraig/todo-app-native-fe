import React from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Navigation from "./Navigation";
export default function App() {
  return (
    <BottomSheetModalProvider>
      <Navigation />
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({});
