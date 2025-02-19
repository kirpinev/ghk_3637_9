import { ButtonMobile } from "@alfalab/core-components/button/mobile";

import { Typography } from "@alfalab/core-components/typography";
import React, { useState } from "react";
import imageGH1 from "./assets/imageGH1.png";
import imageGH2 from "./assets/imageGH2.png";
import imageGH3 from "./assets/imageGH3.png";
import imageGH4 from "./assets/imageGH4.png";
import imageGH5 from "./assets/imageGH5.png";
import imageGH6 from "./assets/imageGH6.png";
import imageGH7 from "./assets/imageGH7.png";
import imageGH8 from "./assets/imageGH8.png";
import hero from "./assets/hero.png";
import { LS, LSKeys } from "./ls";
import { appSt } from "./style.css";
import { ThxLayout } from "./thx/ThxLayout";
import { Gap } from "@alfalab/core-components/gap";
import { Plate } from "@alfalab/core-components/plate";
import { StatusBadge } from "@alfalab/core-components/status-badge";
import { Contacts } from "./contacts/Contacts.tsx";
import { sendDataToGAWithoutContacts } from "./utils/events.ts";

interface Product {
  title: string;
  text: string;
  image: string;
  name: string;
  value: number;
}

interface Categories {
  title: string;
  products: Array<Product>;
}

const categories: Array<Categories> = [
  {
    title: "Кэшбэк",
    products: [
      {
        title: "Кредитные каникулы",
        text: "До 6 месяцев в году",
        image: imageGH1,
        name: "credit_holidays",
        value: 0,
      },
      {
        title: "Настройка платежа",
        text: "Можно уменьшить платёж по кредиту в любой момент",
        image: imageGH2,
        name: "nastroika_platezha",
        value: 0,
      },
      {
        title: "Выбор даты платежа",
        text: "Вносите деньги в удобные дни",
        image: imageGH3,
        name: "vybor_daty_platezha",
        value: 0,
      },
      {
        title: "Гибкий график платежей",
        text: "Можете пропустить месяц, а в следующем заплатить больше",
        image: imageGH4,
        name: "gibkiy_grafik_platezhey",
        value: 0,
      },
      {
        title: "Беспроцентная кредитная линия",
        text: "Можете взять до 30 000 ₽ без % на мелкие расходы",
        image: imageGH5,
        name: "no_percent_credit_line",
        value: 0,
      },
      {
        title: "Защита от просрочки",
        text: "Автоматически оплатим кредит с вашего счёта",
        image: imageGH6,
        name: "zashita_ot_prosrochki",
        value: 0,
      },
      {
        title: "Контроль кредитной истории",
        text: "Защита от мошенников, заявки на кредит, кредитный рейтинг",
        image: imageGH7,
        name: "credit_history_control",
        value: 0,
      },
      {
        title: "Переводы без ограничений",
        text: "Переводите кредитные деньги физическим и юридическим лицам бесплатно",
        image: imageGH8,
        name: "perevody_bez_ogranicheniy",
        value: 0,
      },
    ],
  },
];

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [optionsCount, setOptionsCount] = useState(3);
  const isFiveOptionsSelected = optionsCount > 0 && optionsCount <= 3;
  const [configuredProducts, setConfiguredProducts] = useState<
    Record<string, number>
  >({});

  const findProduct = (product: Product) => {
    return selectedProducts.find((option) => option.title === product.title);
  };

  const selectProducts = (product: Product) => {
    const find = findProduct(product);
    const filteredProducts = selectedProducts.filter(
      (p) => p.title !== product.title,
    );

    if (filteredProducts.length === 3) {
      return;
    }

    if (find) {
      product.value = 0;
      setSelectedProducts(filteredProducts);
      setOptionsCount((prevState) => prevState + 1);
    } else {
      product.value = 1;
      setSelectedProducts([...selectedProducts, product]);
      setOptionsCount((prevState) => prevState - 1);
    }
  };

  const submit = () => {
    const products: Record<string, number> = {};

    selectedProducts.forEach((product) => {
      products[product.name] = product.value;
    });

    categories.forEach((category) => {
      category.products.forEach((product) => {
        if (products[product.name] === undefined) {
          products[product.name] = product.value;
        }
      });
    });

    setConfiguredProducts(products);
    setLoading(true);
    sendDataToGAWithoutContacts({
      ...(products as Record<string, number>),
    }).then(() => {
      setContacts(true);
      setLoading(false);
    });
  };

  const optionText = (count: number) => {
    switch (count) {
      case 1:
        return ["опцию", "которую"];
      case 2:
      case 3:
      case 4:
        return ["опции", "которые"];
      case 5:
        return ["опций", "которые"];
    }
  };

  if (LS.getItem(LSKeys.ShowThx, false)) {
    return <ThxLayout />;
  }

  if (contacts) {
    return <Contacts configuredProducts={configuredProducts} />;
  }

  return (
    <>
      <div className={appSt.container}>
        <div className={appSt.box}>
          <img src={hero} alt="Картинка Альфа-Смарт" />
          <Typography.TitleResponsive
            tag="h1"
            view="medium"
            font="system"
            weight="bold"
            style={{ padding: "0 1rem" }}
          >
            Прокачайте ваш кредит
          </Typography.TitleResponsive>
          <Typography.Text view="primary-large" color="secondary">
            с подпиской
          </Typography.Text>
        </div>

        <Gap size={4} />

        <Plate
          view={isFiveOptionsSelected ? "attention" : "positive"}
          title={
            isFiveOptionsSelected
              ? `Выберите ${optionsCount} ${optionText(optionsCount)?.[0]}, ${optionText(optionsCount)?.[1]} хотите включить в вашу подписку`
              : "Все 3 опции выбраны"
          }
          leftAddons={
            <StatusBadge
              view={
                isFiveOptionsSelected ? "attention-alert" : "positive-checkmark"
              }
            />
          }
        />

        <div className={appSt.products}>
          {categories.map((category) => (
            <React.Fragment key={category.title}>
              <Gap size={4} />
              {category.products.map((product) => (
                <div
                  className={appSt.product}
                  key={product.title}
                  onClick={() => {
                    selectProducts(product);
                  }}
                  style={{
                    ...(findProduct(product)
                      ? {
                          border: "2px solid #0cc44d",
                        }
                      : { border: "2px solid #F2F3F5", opacity: "0.5" }),
                  }}
                >
                  {findProduct(product) && (
                    <StatusBadge
                      view={"positive-checkmark"}
                      size={24}
                      className={appSt.statusBadge}
                    />
                  )}
                  <div>
                    <Typography.TitleResponsive
                      font="system"
                      view="small"
                      weight="bold"
                      tag="h3"
                      className={appSt.productTitle}
                    >
                      {product.title}
                    </Typography.TitleResponsive>

                    <Typography.Text
                      view="primary-small"
                      tag="p"
                      color="secondary"
                      className={appSt.productText}
                    >
                      {product.text}
                    </Typography.Text>
                  </div>
                  <img
                    src={product.image}
                    alt=""
                    width={96}
                    height={96}
                    className={appSt.productIcon}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <ButtonMobile
          loading={loading}
          disabled={selectedProducts.length !== 3}
          block
          view="primary"
          onClick={submit}
        >
          Оформить подписку
        </ButtonMobile>
      </div>
    </>
  );
};
