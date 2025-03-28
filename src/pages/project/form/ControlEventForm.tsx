import { Formik, type FormikHelpers } from "formik";
// import * as yup from 'yup';
import { type ControlEventDto, type ControlEventTransitionDto } from "@shared/types/apiTypes";
import type { JsonObject } from "@shared/types/json";
import { RecursiveField } from "./RecursiveField";
import { FieldGroupWrapper } from "@pages/project/form/groupWrapper/FieldGroupWrapper";
import { memo, useMemo, useRef, type FC, type ReactNode } from "react";
import * as styles from "./ControlEventForm.module.scss";
import { FormButtons } from "./FormButtons";
import { FieldsLayout } from "./FieldsLayout";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import { undoPartial } from "../../../shared/types/utils";
// import { Text } from "@v-uik/base";
import { Typography } from "antd"; // Новый импорт
export interface ControlEventFormProps {
  data: ControlEventDto;
  handleSubmit: (values: JsonObject, goToStatus: ControlEventTransitionDto | null) => Promise<void>;
}

export const ControlEventForm: FC<ControlEventFormProps> = memo((props) => {
  // const signupSchema = yup.object().shape({
  //   name: yup.string().required()
  // });
  useTraceUpdate("ControlEventForm", props);
  const { handleSubmit, data } = props;

  const initialValues = useMemo(
    () => data.fields.reduce<JsonObject>((ac, x) => ((ac[x.descriptor.propDescriptor.id] = x.value), ac), {}),
    [data]
  );

  console.log("ControlEventForm0data", data);
  console.log("ControlEventForm0initialValues", initialValues);

  const buttonValueRef = useRef<ControlEventTransitionDto | null>(null);

  const formSubmit = async (values: JsonObject, _formik: FormikHelpers<JsonObject>) => {
    const btn = buttonValueRef.current;
    await handleSubmit(values, btn);
    // https://formik.org/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany
    // formik.setSubmitting(false) // call manually for synchronous submit function
  };

  return (
    <Formik<JsonObject> enableReinitialize initialValues={initialValues} onSubmit={formSubmit}>
      {(formik) => (
        <form autoComplete="off">
          <DynamicForm data={data} />
          <br />
          <FormButtons
            transitions={data.transitions}
            isSubmitting={formik.isSubmitting}
            onSubmit={formik.submitForm}
            buttonValueRef={buttonValueRef}
          />
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={() => {
                console.log(formik);
              }}
            >
              DEBUG
            </button>
          )}
        </form>
      )}
    </Formik>
  );
});

const DynamicForm = memo((props: { data: ControlEventDto }): ReactNode => {
  const { data } = props;
  useTraceUpdate("DynamicForm", props);

  const groups = useMemo(
    () => Object.entries(undoPartial(Object.groupBy(data.fields, (x) => x.descriptor.propDescriptor.group))),
    [data]
  );

  return (
    <>
      <div className={styles.title}>
        {/*<Text as="div" kind="headline5">*/}
        {/*  {data.status.stageDescription}*/}
        {/*</Text>*/}
        {/*<Text as="div" kind="titleMd">*/}
        {/*  Статус: {data.status.description}*/}
        {/*</Text>*/}
        <Typography.Title level={3}>{data.status.stageDescription}</Typography.Title>
        <Typography.Title level={4}>Статус: {data.status.description}</Typography.Title>
      </div>
      <div className={styles.groups}>
        {groups.map(([name, ffv]) => (
          <FieldGroupWrapper key={name} name={name}>
            <FieldsLayout>
              {ffv.map((fv) => {
                const fd = fv.descriptor;
                const inputId = fd.propDescriptor.id;

                return <RecursiveField key={inputId} fieldDescriptor={fd} inputId={inputId} />;
              })}
            </FieldsLayout>
          </FieldGroupWrapper>
        ))}
      </div>
    </>
  );
});
