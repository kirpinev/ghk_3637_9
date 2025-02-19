import { useState } from "react";

import { Typography } from "@alfalab/core-components/typography";
import { ButtonMobile } from "@alfalab/core-components/button/mobile";
import { Input } from "@alfalab/core-components/input";
import { Gap } from "@alfalab/core-components/gap";
import { MaskedInput } from "@alfalab/core-components/masked-input";

import { thxSt } from "./style.css";
import { appSt } from "../style.css.ts";
import { sendDataToGAWithContacts } from "../utils/events.ts";
import { LS, LSKeys } from "../ls";

interface ThxLayoutProps {
  configuredProducts: Record<string, number>;
}

export const Contacts = ({ configuredProducts }: ThxLayoutProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    LS.setItem(LSKeys.ShowThx, true);
    setLoading(true);
    sendDataToGAWithContacts({
      ...configuredProducts,
      contacts: `${name} ${phone}`,
    }).then(() => {
      setLoading(false);
    });
  };

  return (
    <>
      <div className={thxSt.container}>
        <Typography.TitleResponsive
          font="system"
          tag="h1"
          view="medium"
          defaultMargins={false}
          weight="bold"
          className={thxSt.title}
        >
          Предложение ещё в разработке
        </Typography.TitleResponsive>
        <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
          Хотим понять, кому это интересно. Напишите имя и 4 цифры номера —
          никаких звонков и сообщений от нас
        </Typography.Text>

        <Gap size={32} />

        <Input
          block={true}
          placeholder="Имя"
          labelView="outer"
          size={48}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Gap size={8} />

        <MaskedInput
          value={phone}
          onChange={(_, payload) => setPhone(payload.value)}
          mask={[/\d/, /\d/, /\d/, /\d/]}
          placeholder="4 последние цифры номера телефона"
          labelView="outer"
          size={48}
          block={true}
        />
      </div>

      <div className={appSt.bottomBtn}>
        <ButtonMobile
          block
          disabled={name.length < 1 || phone.length < 4}
          loading={loading}
          onClick={submit}
          view="primary"
          href="https://alfa.me/p0r7na"
        >
          Отправить
        </ButtonMobile>
      </div>
    </>
  );
};
