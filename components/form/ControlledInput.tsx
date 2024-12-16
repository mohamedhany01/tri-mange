import { Controller, Control, FieldError } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";

interface ControlledInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  rules?: object;
  error?: FieldError;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  control,
  name,
  label,
  placeholder,
  rules,
  error,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[
              styles.input,
              error ? styles.errorInput : styles.normalInput,
            ]}
            {...textInputProps}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  normalInput: { borderColor: "gray" },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginTop: 5 },
});

export default ControlledInput;
