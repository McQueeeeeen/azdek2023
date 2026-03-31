import Container from "../ui/container";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer-inner">
        <p>{"AZDEK \u0411\u044B\u0442\u043E\u0432\u0430\u044F \u0445\u0438\u043C\u0438\u044F"}</p>
        <p className="text-secondary">
          {"\u0427\u0438\u0441\u0442\u044B\u0435 \u0444\u043E\u0440\u043C\u0443\u043B\u044B. \u041D\u0430\u0434\u0435\u0436\u043D\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442."}
        </p>
      </Container>
    </footer>
  );
}

