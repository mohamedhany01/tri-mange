import React, { useState } from "react";

import DynamicButton from "@/components/DynamicButton";

interface SubmitButtonProps {
  onSubmit: () => Promise<void>;
  title: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  title,
  disabled = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = async () => {
    if (disabled || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      throw new Error(`Error during submission ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DynamicButton
      variant="success"
      onPress={handlePress}
      title={title}
      disabled={disabled || isSubmitting}
      loading={isSubmitting}
    />
  );
};

export default SubmitButton;
