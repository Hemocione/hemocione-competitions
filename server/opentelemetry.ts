import process from "process";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";

const exporterOptions = {
  url: process.env.OTEL_EXPORTER_OTLP_SPAN_ENDPOINT,
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new UndiciInstrumentation(),
    new PgInstrumentation(),
  ],
  serviceName: process.env.OTEL_SERVICE_NAME ?? "hemocione-competitions",
});

console.log("Starting OpenTelemetry...");
sdk.start();
console.log("OpenTelemetry started!");

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing OpenTelemetry...");
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
