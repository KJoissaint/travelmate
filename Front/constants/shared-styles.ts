import { StyleSheet } from "react-native";

export const SharedStyles = StyleSheet.create({
  // General containers
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  // Headers
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  // Inputs
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111827",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "transparent",
    gap: 12,
  },

  // Buttons
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  switchModeText: {
    color: "#a855f7",
    fontSize: 14,
    fontWeight: "600",
  },

  // Error / feedback
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 8,
  },

  // Banner styles (from _layout.tsx)
  offlineBanner: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingTop: 50,
    gap: 8,
  },
  syncBanner: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingTop: 50,
    gap: 8,
  },
  bannerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Add-trip specific
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 2,
    borderColor: "transparent",
  },
});
