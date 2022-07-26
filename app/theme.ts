import { ButtonProps, MantineTheme } from "@mantine/core";

const ExampleButtonDefaultProps: Partial<ButtonProps> = {
  size: 'xs',
  color: 'cyan',
};

export const theme: Partial<MantineTheme> = {
  colorScheme: 'light',
  // components: {
  //   TypographyStylesProvider: {
  //     styles: {
  //       root: {
  //         '& h1': { color: 'red' },
  //         '& h3': { color: 'blue' },
  //       },
  //     },
  //   },
  //   Button: { defaultProps: ExampleButtonDefaultProps },
  // }
}