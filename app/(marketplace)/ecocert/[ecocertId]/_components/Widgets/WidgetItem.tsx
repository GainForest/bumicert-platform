import React from "react";

const WidgetItem = ({
  children,
  title,
  toolbar,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  toolbar?: React.ReactNode;
}) => {
  return (
    <section className="flex flex-col p-3 gap-2">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-2xl font-bold font-serif text-primary">{title}</h2>
        {toolbar}
      </div>
      {children}
    </section>
  );
};

export default WidgetItem;
