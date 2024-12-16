import { Controller, Control, FieldError } from "react-hook-form";
import { View, Text, StyleSheet, TextInputProps } from "react-native";
import { FakeCurrencyInput } from "react-native-currency-input";

interface ControlledNumberInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  rules?: object;
  error?: FieldError;
  delimiter?: string;
  separator?: string;
  precision?: number;
  style?: any;
}

const ControlledNumberInput: React.FC<ControlledNumberInputProps> = ({
  control,
  name,
  label,
  placeholder,
  rules,
  error,
  delimiter,
  separator,
  precision,
  style,
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
          <View>
            <FakeCurrencyInput
              placeholder={placeholder}
              placeholderTextColor={"gray"}
              onBlur={onBlur}
              onChangeValue={onChange}
              value={value}
              delimiter={delimiter}
              separator={separator}
              precision={precision}
              style={[
                styles.input,
                error ? styles.errorInput : styles.normalInput,
              ]}
              {...textInputProps}
            />
          </View>
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
    width: "100%",
    fontSize: 14,
    fontWeight: "400",
    // color: "grey",
  },
  normalInput: { borderColor: "gray" },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginTop: 5 },
});

export default ControlledNumberInput;
