interface JsonLdScriptProps {
  data: Record<string, any> | Array<Record<string, any>> | null | undefined;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

