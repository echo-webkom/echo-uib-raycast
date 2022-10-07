const HappeningPreview = () => {
  <List.Item
    key={i}
    title={happening.title}
    subtitle={format(new Date(happening.date), "d. MMMM yyyy", {
      locale: nb,
    })}
    actions={
      <ActionPanel>
        <Action
          title="Vis arrangement"
          onAction={() =>
            push(<HappeningBySlug type={type} slug={happening.slug} />)
          }
        />
      </ActionPanel>
    }
  />;
};
