import { ButtonMobile } from "@alfalab/core-components/button/mobile";

import { Typography } from "@alfalab/core-components/typography";
import React, { useState } from "react";
import smart from "./assets/smart.png";
import smile from "./assets/smile.png";
import drums from "./assets/drums.png";
import smileArrow from "./assets/smile-arrow.png";
import gift from "./assets/gift.png";
import cashback from "./assets/cashback.png";
import { LS, LSKeys } from "./ls";
import { appSt } from "./style.css";
import { ThxLayout } from "./thx/ThxLayout";
import { Gap } from "@alfalab/core-components/gap";
import { Plate } from "@alfalab/core-components/plate";
import { StatusBadge } from "@alfalab/core-components/status-badge";

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
        image: smileArrow,
        name: "one_cashback",
        value: 0,
      },
      {
        title: "Настройка платежа",
        text: "Можно уменьшить платёж по кредиту в любой момент",
        image: drums,
        name: "one_baraban",
        value: 0,
      },
      {
        title: "Выбор даты платежа",
        text: "Вносите деньги в удобные дни",
        image: cashback,
        name: "limit_cashback",
        value: 0,
      },
      {
        title: "Гибкий график платежей",
        text: "Можете пропустить месяц, а в следующем заплатить больше",
        image: gift,
        name: "secret_cashback",
        value: 0,
      },
      {
        title: "Беспроцентная кредитная линия",
        text: "Можете взять до 30 000 ₽ без % на мелкие расходы",
        image: gift,
        name: "secret_cashback",
        value: 0,
      },
      {
        title: "Защита от просрочки",
        text: "Автоматически оплатим кредит с вашего счёта",
        image: gift,
        name: "secret_cashback",
        value: 0,
      },
      {
        title: "Контроль кредитной истории",
        text: "Защита от мошенников, заявки на кредит, кредитный рейтинг",
        image: gift,
        name: "secret_cashback",
        value: 0,
      },
      {
        title: "Переводы без ограничений",
        text: "Переводите кредитные деньги физическим и юридическим лицам бесплатно",
        image: gift,
        name: "secret_cashback",
        value: 0,
      },
    ],
  },
];

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [optionsCount, setOptionsCount] = useState(3);
  const isFiveOptionsSelected = optionsCount > 0 && optionsCount <= 3;

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

    setLoading(true);
    Promise.resolve().then(() => {
      LS.setItem(LSKeys.ShowThx, true);
      setThx(true);
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

  if (thxShow) {
    return <ThxLayout />;
  }

  return (
    <>
      <div className={appSt.container}>
        <div className={appSt.box}>
          <img src={smart} alt="Картинка Альфа-Смарт" />
          <Typography.TitleResponsive
            tag="h1"
            view="medium"
            font="system"
            weight="bold"
          >
            Прокачайте ваш кредит
          </Typography.TitleResponsive>
          <Typography.Text view="primary-large" color="secondary">
            с подпиской
          </Typography.Text>
        </div>

        <div className={appSt.subscription}>
          <img src={smile} alt="" width={24} height={24} />
          <Typography.Text
            view="primary-medium"
            className={appSt.subscriptionText}
          >
            Подписка стоит 299 ₽, если тратите с карты 20 000 ₽ в месяц. Если
            тратите меньше — 399 ₽
          </Typography.Text>
        </div>

        <Gap size={8} />

        {
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
                  isFiveOptionsSelected
                    ? "attention-alert"
                    : "positive-checkmark"
                }
              />
            }
          />
        }

        <div className={appSt.products}>
          {categories.map((category) => (
            <React.Fragment key={category.title}>
              <Gap size={8} />
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
          disabled={selectedProducts.length !== 3}
          loading={loading}
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
