"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const vegetarianQuestions = {
  27: "Indicami se per <b>pranzo</b> prenderesti in considerazione la possibilità di consumare un <b>piatto unico</b> (insalata di cereale o patate) composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Cereale</b> integrale in chicco (es: Riso o simile) o <b>patate</b> comuni (o Americane)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pietanza</b>. Intendo per esempio: Fiocchi di Latte magri, Feta Light, Tofu, Piselli, Uova Intere (o solo Albume), Affettato vegetale di Mopur o Lupini, Tempeh, Fagioli di Soia Edamame.</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>contorno di <b>verdure</b> cotte o crude da consumare in maniera dissociata dal piatto unico oppure da spezzettare ed includere nel piatto unico.</li></ol>",
  30: "Per la <b>cena</b> le indicazioni saranno di abbinare, secondo ben precise frequenze di assunzione settimanale, un pasto composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span>una <b>Pietanza</b> (es: Tempeh, Burger di Soia, Uova, Formaggi, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pane</b> o patate o derivato secco (es: Crostini integrali Buitoni, fette WASA Integrali, Gallette integrali di Farro o Kamut o Riso o Mais, pane o derivato secco senza glutine se è necessario)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>porzione di <b>Verdura</b> cruda o cotta</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='4'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>4)</span>porzione di <b>Frutta fresca</b> a fine pasto. Confermami o meno la possibilità di sfruttare questa impostazione di pasti per cena e scrivimi, se esistono, eventuali necessità personali particolari per questo pasto.</li></ol>",
  32: "In questa prima fase il <strong>pasto libero sarà 1 a settimana</strong> all’interno della giornata che più preferirai sfruttare per farlo. Al pasto libero si è “liberi” di consumare tutto ciò che desideriamo (pizza o qualsiasi primo piatto o secondo piatto o panino di tuo gradimento). Scrivimi, se esistono, eventuali necessità personali particolari per questo pasto, altrimenti scrivi ''ok''.",
};

const veganQuestions = {
  27: "Indicami se per <b>pranzo</b> prenderesti in considerazione la possibilità di consumare un <b>piatto unico</b> (insalata di cereale o patate) composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Cereale</b> integrale in chicco (es: Riso o simile) o <b>patate</b> comuni (o Americane)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pietanza</b>. Intendo per esempio: Tofu, Piselli, Affettato vegetale di Mopur o Lupini, Tempeh, Fagioli di Soia Edamame, Legumi.</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>contorno di <b>verdure</b> cotte o crude da consumare in maniera dissociata dal piatto unico oppure da spezzettare ed includere nel piatto unico.</li></ol>",
  30: "Per la <b>cena</b> le indicazioni saranno di abbinare, secondo ben precise frequenze di assunzione settimanale, un </b>pasto composto da</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span>una <b>Pietanza</b> (es: Tempeh, Burger Vegani fatti in casa, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pane</b> o patate o derivato secco (es: Crostini integrali Buitoni, fette WASA Integrali, Gallette integrali di Farro o Kamut o Riso o Mais, pane o derivato senza glutine se è necessario)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>porzione di <b>Verdura</b> cruda o cotta</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='4'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>4)</span>porzione di <b>Frutta fresca</b> a fine pasto. Confermami o meno la possibilità di sfruttare questa impostazione di pasti per cena e scrivimi, se esistono, eventuali necessità personali particolari per questo pasto.</li></ol>",
  32: 'In questa prima fase il <strong>pasto libero sarà 1 a settimana</strong> all\'interno della giornata che più preferirai sfruttare per farlo. Al pasto libero si è "liberi" di consumare tutto ciò che desideriamo (pizza o qualsiasi primo piatto o secondo piatto o panino di tuo gradimento). Scrivimi, se esistono, eventuali necessità personali particolari per questo pasto, altrimenti scrivi "ok".',
};

const commonDietQuestions = {
  20: "<b>Quali pasti</b> principali giornalieri (colazione, pranzo, cena) consumi a <b>casa</b> e quali <b>fuori</b> durante la settimana? Se consumi dei pasti <b>fuori</b>, indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Quante volte</b> a settimana (es: dal Lunedì al Venerdì oppure 2 volte a settimana, ecc.)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span><b>Dove</b> ti appoggi (Mensa, Bar, Gastronomia, Ristorante oppure se ti porti qualcosa da casa)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Prenderesti in considerazione la <b>possibilità di prepararli a casa</b> e portarli con te (nel caso in cui non lo facessi già)? Oppure preferiresti <b>ricevere degli orientamenti</b> per la gestione del pasto in Mensa/Bar/Gastronomia/Ristorante.</li></ol>",
  21: "<b>Quanti pasti fai</b> abitualmente ogni giorno (es: solo 2 pasti principali, oppure 3 pasti principali, o 3 pasti principali e 1 o 2 o 3 spuntini)? Indicami anche:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Quali sono</b> esattamente (es: colazione, pranzo, cena, spuntino di metà mattina, spuntino di metà pomeriggio, spuntino dopo cena, ecc.)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Nel caso in cui non ne facessi 5 (colazione, pranzo, cena + 2 spuntini), <b>saresti disposto/a a farne almeno 5</b>?</li></ol>",
  22: "Riguardo alla tipologia di <b>colazione</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Preferisci consumare una <b>colazione dolce</b> e una <b>salata</b> oppure solo opzioni dolci o solo salate?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Scrivimi, se esistono, anche <b>eventuali necessità personali particolari</b> per la colazione (es: un alimento che non può mancare, un abbinamento di cui non puoi fare a meno, ecc.).</li></ol>",
  23: "Scrivi <strong>2 tipologie di colazioni</strong> che consumi più di frequente:",
  24: "In merito al <b>caffè</b>, se lo consumi, indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Quanti caffè</b> consumi durante la giornata?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Sono <b>amari o dolcificati</b> con zucchero o con dolcificanti acalorici (tipo DIETIC classico o Stevia o Eritritolo)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Nel caso dolcificassi il caffè abitualmente con lo zucchero ma ti proponessi di utilizzare in <b>alternativa dolcificanti acalorici naturali</b> come la Stevia o l'Eritritolo (rispetto alla Stevia non conferisce retrogusto), potremmo inserirli?</li></ol>",
  25: "Se consumi <b>spuntini</b> durante il giorno allora indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Cosa</b> ti capita di consumare abitualmente?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Scrivimi, se esistono, anche <b>eventuali necessità personali particolari</b> per gli spuntini (es: un alimento che non può mancare, spuntini pratici da consumare fuori casa, ecc.)</li></ol>",
  26: "Riguardo al <b>pranzo</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Solitamente consumi un <b>primo</b> piatto (a base di pasta o riso) o un <b>secondo</b> piatto (pietanza) o fai <b>entrambi</b> nello stesso pasto?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Indicami anche se per te è molto importante chiudere il pranzo con la <b>frutta fresca</b> o se ne potresti fare anche a meno.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Scrivimi, se esistono, <b>eventuali necessità personali particolari</b> per il pranzo.</li></ol>",
  28: "Indicami se per <b>pranzo</b> prenderesti in considerazione il consumo di un pasto a base di <b>Legumi</b> composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Legumi</b> da consumare <b>in zuppa o asciutti o in vellutata</b></li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pane</b> tostato o derivato secco (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut, pane o derivato senza glutine se è necessario)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>porzione di <b>Verdura</b> cotta (Minestrone o verdure a gradimento) o cruda.</li></ol>",
  29: "Indicami se per <b>pranzo</b> prenderesti in considerazione il consumo di un pasto a base di <b>Pasta</b>, composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Pasta</b> di Semola o integrale. Specificami anche se prenderesti in considerazione la pasta a base di <b>farina 100% Legumi come alternativa</b>.</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span>un <b>Condimento semplice</b> (sugo di pomodoro, pesto alla genovese, minestrone, verdure intere saltate in padella o in crema)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>eventuale <b>Pietanza</b></li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='4'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>4)</span>porzione di <b>Verdura</b> cotta o cruda. Riportami anche, se esistono, eventuali necessità personali particolari in merito all'utilizzo di pasta.</li></ol>",
  31: "Riguardo agli <b>alcolici</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span>Bevi <b>alcolici</b>?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span>Se si allora specificami se li bevi <b>quotidianamente o solo il fine settimana</b>.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span>Indicami la <b>quantità consumata</b> di vino (in bicchieri) o di birra (specificami quante birre piccole o grandi) o di drink (in bicchieri).</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span>Nel caso in cui il consumo di alcol sia quotidiano, specificami se potresti <b>farne completamente a meno</b> o se saresti disponibile a <b>ridurlo</b>.</li></ol>",
  33: "Riportami di seguito i dati utili all'<b>emissione della fattura</b> che ti invierò una volta che sarà pronto il piano alimentare. I dati da riportare sono i seguenti:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span><b>Luogo di nascita</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span><b>Via di residenza</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span><b>Numero civico</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span><b>CAP</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>5)</span><b>Città</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>6)</span><b>Codice fiscale</b>.</li></ol>",
  34: 'Con riferimento alla Legge 31/12/1996 "tutela delle persone e di altri soggetti al <strong>trattamento dei dati personali</strong>", il sottoscritto (ossia il richiedente la consulenza) spuntando la casella "Autorizzo" ed inviando il questionario esprime il proprio consenso ed autorizza il Dr. Bernardo Giammetta al trattamento dei dati personali limitatamente ai fini di dietoterapia. Prende atto inoltre che i propri dati personali possono essere inseriti in un archivio cartaceo o elettronico.',
};

// Funzione globale per gestire i cambiamenti delle textarea
window.handleTextareaChange = function (event, id) {
  event.preventDefault(); // Previene il comportamento di default
  const textarea = event.target;
  const newAnswers = { ...window.answers, [id]: textarea.value };
  localStorage.setItem("questionnaire_answers", JSON.stringify(newAnswers));
  window.setAnswers(newAnswers);
};

export default function NutritionalQuestionnaire() {
  const savedQuestion = localStorage.getItem("currentQuestion");
  const [currentQuestion, setCurrentQuestion] = useState(
    savedQuestion ? parseInt(savedQuestion) : -1
  );
  const savedAnswers = localStorage.getItem("questionnaire_answers");
  const [answers, setAnswers] = useState(
    savedAnswers ? JSON.parse(savedAnswers) : {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextareaChange = (event, id) => {
    if (typeof id === "string") {
      // Per le domande speciali (19)
      const newAnswers = { ...answers, [id]: event.target.value };
      localStorage.setItem("questionnaire_answers", JSON.stringify(newAnswers));
      setAnswers(newAnswers);
    } else {
      // Per tutte le altre domande
      const newAnswers = { ...answers, [currentQuestion]: event.target.value };
      localStorage.setItem("questionnaire_answers", JSON.stringify(newAnswers));
      setAnswers(newAnswers);
    }
  };

  // Rendi gli stati accessibili globalmente
  window.answers = answers;
  window.setAnswers = setAnswers;

  const getTotalQuestions = () => {
    if (answers[17] === "vegetariano" || answers[17] === "vegano") {
      return 34;
    }
    return questions.length;
  };

  const getQuestionText = (index) => {
    const dietType = answers[17];

    if (index === 18) {
      // domanda 19 (index 18)
      if (dietType === "onnivoro") {
        // Per lo stile onnivoro, usa la domanda dall'array questions
        return questions[18];
      } else if (dietType === "vegetariano") {
        return (
          "Indicami tra i cibi elencati di seguito se sono presenti <b>alimenti che non consumi assolutamente</b> e che quindi non verranno inseriti nel piano. Scrivi gli alimenti che non gradisci nelle relative caselle di risposta sottostante altrimenti, se gradisci tutto, lascia la casella relativa vuota.<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span><b>Fonti proteiche vegetali</b>: Tempeh, Burger di Soia, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi (es: Ceci, Fagioli, Piselli, Lenticchie).<textarea id='veg_19_1' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"veg_19_1\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["veg_19_1"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span><b>Uova</b>: sia in versione intera che soli albumi (in brick o tetrapack).<textarea id='veg_19_2' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"veg_19_2\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["veg_19_2"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span><b>Formaggi</b>: sia <u>freschi</u> nella versione light (es: Mozzarella, Stracchino, Ricotta, Feta, Fiocchi di Latte, Philadelphia) che <u>stagionati</u> (es: Parmigiano, Grana, Asiago, Emmenthal, Pecorino). Se non vuoi assolutamente assumere la versione light dei formaggi freschi specificalo. Prenderemo in considerazione anche la versione senza lattosio solo se è necessario.<textarea id='veg_19_3' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"veg_19_3\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["veg_19_3"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span><b>Condimento</b>: di base sarà inserito l'olio extravergine d'oliva. Specificami se potrebbe interessarti in alternativa anche l'avocado scrivendo ''si avocado'' oppure ''no avocado''.<textarea id='veg_19_4' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"veg_19_4\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["veg_19_4"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>5)</span><b>Verdure</b>: <u>cotte</u> (es: Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini) o <u>crude</u> (es: Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli).<textarea id='veg_19_5' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"veg_19_5\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["veg_19_5"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>6)</span><b>Fonte di carboidrati</b>: pasta, cereale in chicco (es: riso o farro o simili), patate, pane, derivato secco del pane (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut o Riso o Mais, se è necessario utilizzeremo derivati secchi simili ma senza glutine).<textarea id='veg_19_6' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"veg_19_6\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["veg_19_6"] || "") +
          "</textarea></li></ol>"
        );
      } else if (dietType === "vegano") {
        return (
          "Indicami tra i cibi elencati di seguito se sono presenti <b>alimenti che non consumi assolutamente</b> e che quindi non verranno inseriti nel piano. Scrivi gli alimenti che non gradisci nelle relative caselle di risposta sottostanti altrimenti, se gradisci tutto, lascia la casella relativa vuota.<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span><b>Fonti proteiche vegetali</b>: Lievito in scaglie, Tempeh, Burger Vegani fatti in casa, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi (es: Ceci, Fagioli, Piselli, Lenticchie, Soia Edamame).<textarea id='vega_19_1' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"vega_19_1\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["vega_19_1"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span><b>Condimento</b>: di base sarà inserito l’olio extravergine d’oliva. Specificami se potrebbe interessarti in alternativa anche l’<u>avocado</u> scrivendo “si avocado” oppure “no avocado”.<textarea id='vega_19_2' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"vega_19_2\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["vega_19_2"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span><b>Verdure</b>: <u>cotte</u> (es: Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini) o <u>crude</u> (es: Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli).<textarea id='vega_19_3' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"vega_19_3\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["vega_19_3"] || "") +
          "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span><b>Fonte di carboidrati</b>: pasta, cereale in chicco (es: riso o farro o simili), patate, pane, derivato secco del pane (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut o Riso o Mais, se è necessario utilizzeremo derivati secchi simili ma senza glutine).<textarea id='vega_19_4' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"vega_19_4\")' placeholder='Scrivi qui la tua risposta...'>" +
          (answers["vega_19_4"] || "") +
          "</textarea></li></ol>"
        );
      }
    }

    if (dietType === "vegetariano" || dietType === "vegano") {
      // Per le domande comuni
      if (commonDietQuestions[index]) {
        return commonDietQuestions[index];
      }

      // Per le domande specifiche della dieta
      if (dietType === "vegano" && veganQuestions[index]) {
        return veganQuestions[index];
      } else if (dietType === "vegetariano" && vegetarianQuestions[index]) {
        return vegetarianQuestions[index];
      }

      return questions[index];
    }
    return questions[index];
  };

  const getCurrentQuestion = () => {
    const dietType = answers[17];
    let currentQuestionIndex = currentQuestion;

    if (dietType === "vegetariano" || dietType === "vegano") {
      // Gestiamo tutte le transizioni da 19 a 34
      if (currentQuestionIndex >= 19 && currentQuestionIndex <= 34) {
        // Array delle corrispondenze per le domande
        const questionMappings = {
          19: 20, // dalla 19 andiamo alla 20
          20: 21, // dalla 20 andiamo alla 21
          21: 22, // dalla 21 andiamo alla 22
          22: 23,
          23: 24,
          24: 25,
          25: 26,
          26: 27,
          27: 28,
          28: 29,
          29: 30,
          30: 31,
          31: 32,
          32: 33,
          33: 34,
        };

        // Se l'indice corrente ha una mappatura, la usiamo
        if (questionMappings[currentQuestionIndex]) {
          return questionMappings[currentQuestionIndex];
        }
      }

      // Aggiunto controllo per l'ultima domanda
      if (currentQuestionIndex >= 33) {
        return 33; // Ci assicuriamo che l'ultima domanda sia la 33
      }
    }
    return currentQuestionIndex;
  };

  const getDisplayQuestionNumber = () => {
    const dietType = answers[17];
    let displayNumber = currentQuestion + 1;

    if (dietType === "vegetariano" || dietType === "vegano") {
      // Manteniamo il numero corretto dopo la domanda 19
      if (currentQuestion === 19) {
        return 20; // Forziamo il numero 20 per la domanda successiva alla 19
      }
      // Per le domande successive manteniamo la numerazione corretta
      if (displayNumber > 20) {
        return displayNumber;
      }
    }
    return displayNumber;
  };

  const getSubtitle = (questionNumber) => {
    const dietType = answers[17];

    if (dietType === "vegetariano" || dietType === "vegano") {
      // Gestione per stili vegetariano e vegano
      let adjustedNumber = questionNumber;
      if (questionNumber > 19) {
        adjustedNumber = questionNumber + 1;
      }

      if (adjustedNumber <= 4) return "Generalità e Contatti";
      if (adjustedNumber <= 10) return "Stile di Vita";
      if (adjustedNumber <= 16) return "Informazioni Cliniche";
      if (adjustedNumber === 17) return "Obiettivo Personale";
      if (adjustedNumber <= 22) return "Abitudini Alimentari";
      if (adjustedNumber <= 25) return "Colazione";
      if (adjustedNumber === 26) return "Spuntini";
      if (adjustedNumber <= 30) return "Pranzo";
      if (adjustedNumber === 31) return "Cena";
      if (adjustedNumber <= 33) return "Alcol e Pasto Libero";
      if (questionNumber === 34) return "Privacy";
      return "Dati Fatturazione";
    } else {
      // Gestione originale per stile onnivoro
      if (questionNumber <= 4) return "Generalità e Contatti";
      if (questionNumber <= 10) return "Stile di Vita";
      if (questionNumber <= 16) return "Informazioni Cliniche";
      if (questionNumber === 17) return "Obiettivo Personale";
      if (questionNumber <= 22) return "Abitudini Alimentari";
      if (questionNumber <= 25) return "Colazione";
      if (questionNumber === 26) return "Spuntini";
      if (questionNumber <= 30) return "Pranzo";
      if (questionNumber === 31) return "Cena";
      if (questionNumber <= 33) return "Alcol e Pasto Libero";
      if (questionNumber === 34) return "Dati Fatturazione";
      return "Privacy";
    }
  };

  const hasAnswer = () => {
    // Per la domanda 19 con stile onnivoro o vegetariano o vegano, permetti sempre di andare avanti
    // Mettiamo questa condizione per prima per essere sicuri che venga valutata
    if (
      currentQuestion === 18 &&
      (answers[17] === "onnivoro" ||
        answers[17] === "vegetariano" ||
        answers[17] === "vegano")
    ) {
      return true;
    }

    const currentAnswer = answers[currentQuestion];

    // Per la domanda con i radio button (domanda 18, indice 17)
    if (currentQuestion === 17) {
      return !!answers[17]; // verifica che sia stata fatta una selezione
    }

    // Per l'ultima domanda (checkbox)
    if (currentQuestion === getTotalQuestions() - 1) {
      return currentAnswer === true;
    }

    // Verifica se c'è una risposta valida
    if (
      typeof currentAnswer !== "string" &&
      typeof currentAnswer !== "boolean"
    ) {
      return false; // nessuna risposta o risposta non valida
    }

    // Per tutte le altre domande con textarea
    return currentAnswer.trim().length > 0;
  };

  const questions = [
    "Scrivimi il tuo <strong>Nome</strong> e <strong>Cognome</strong>:",
    "Riportami la tua <strong>Data di Nascita</strong>. Scrivila nel formato giorno/mese/anno (es: 28/07/1986)",
    "Riportami il tuo <strong>indirizzo e-mail</strong> su cui inviarti tutto il materiale utile a cominciare il nostro percorso, compreso il piano alimentare, nel momento in cui sarà pronto:",
    "Scrivimi il tuo <strong>Numero di Cellulare</strong> per tenerci sempre in contatto per qualsiasi esigenza informativa, sia tua che mia, inerente il nostro percorso:",
    "Hai <strong>mai affrontato un percorso alimentare</strong> con il supporto di un professionista? Se si allora <strong>quante volte</strong> e con quale <strong>obiettivo</strong>?",
    "Svolgi una <strong>tipologia di lavoro</strong> sedentario oppure ti ritrovi a muoverti molto durante le ore lavorative settimanali?",
    "Nelle <strong>ore libere dopo il lavoro</strong> e nelle giornate di riposo dal lavoro tendi ad essere sedentario/a o cerchi di muoverti (per esempio passeggiare, uscire in bici, fare del trekking)?",
    "Svolgi un'attività fisica programmata quindi un <b>allenamento</b> settimanale? Se la risposta è si allora indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>la <b>tipologia</b> di attività svolta (per esempio sala pesi, crossfit, nuoto, pilates, yoga, atletica leggera, ect ect...)</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span><b>quante sedute</b> svogli a settimana</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>la <b>durata</b> di ogni singola seduta</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>4)</span>la <b>fascia oraria</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>5)</span>solo nel caso in cui fossi agonista specificami anche se sei in <b>fase di carico, scarico o pre-competizione</b>.</li></ol>",
    "Hai l'abitudine di <strong>fumare</strong>? Se si indicami quante sigarette al giorno:",
    "Riguardo al <b>sonno</b>, indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Quante ore riesci a <b>dormire</b> <b>continuativamente</b>. In caso di risvegli notturni riportami la causa.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Quante ore dormi <b>in totale</b> (anche se discontinue).</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Nel caso di un <b>sonno cattivo</b> per cause non esterne vorresti consigliata <b>un'integrazione</b> utile per provare a migliorarlo?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>4)</span>In caso di sonno cattivo indicami anche <b>se hai già provato degli integratori</b> (scrivimi i nomi se li ricordi) che però non hanno dato effetti positivi.</li></ol>",
    "In caso di sesso maschile rispondi scrivendo soltanto 'y'. Riguardo al <b>Ciclo:</b><br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Il ciclo è regolare senza <b>pillola</b>? Oppure siamo in Menopausa o Post-menopausa?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Il ciclo è molto <b>doloroso</b> o sopportabile o quasi asintomatico?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>La settimana pre-ciclo e del ciclo è critica dal punto di vista delle <b>tentazioni alimentari</b>?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>4)</span>Nel caso di ciclo doloroso o molto stimolante la fame indicami <b>se stai già assumendo qualche rimedio</b> farmacologico o da integratore? Se è si scrivimi i nomi dei prodotti assunti e le modalità di assunzione</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>5)</span>Nel caso in cui non stessi assumendo nulla per ridurre i fastidi, indicami se vorresti <b>consigliato il protocollo di integrazione</b> naturale utile a renderlo più sopportabile?</li></ol>",
    "Sono presenti <strong>condizioni patologiche</strong> diagnosticate da un Medico? Se si allora riportamele di seguito:",
    "<strong>Assumi farmaci?</strong> Se è si indicami qui sotto il nome e la modalità di assunzione:",
    "<strong>Assumi integratori?</strong> Se è si indicami qui sotto il nome e la modalità di assunzione:",
    "In merito ad <b>allergie</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Sono presenti <b>allergie ad alimenti o stagionali</b> diagnosticate da un medico?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Sia nel caso in cui ci sia una diagnosi medica che <b>nel caso in cui non ci sia una diagnosi medica</b> (ma percepiamo fastidi o sintomi nell'assunzione di particolari cibi) specifichiamole.</li></ol>",
    "Riguardo alla <b>regolarità intestinale</b>, indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Quante volte <b>vai di corpo</b> durante il giorno? Se non vai di corpo giornalmente allora indicami quante volte evacui settimanalmente.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Assumi <b>integratori</b> (scrivi i nomi) per favorire la regolarità? Nel caso non assumessi nulla e non andassi giornalmente di corpo specificami se vorresti consigliato un integratore naturale utile a questo scopo.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Se hai già provato degli <b>integratori che però non hanno dato effetti positivi</b> nel regolarizzarti allora scrivimi i nomi.</li></ol>",
    "Qual è il tuo <b>obiettivo personale</b> per cui vuoi iniziare questo percorso? Indicami se:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Vuoi <b>ridurre</b> il grasso corporeo, quindi il peso, migliorando l'alimentazione?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Oppure <b>aumentare</b> il peso e anche la massa muscolare (valida solo se ci alleniamo) migliorando l'alimentazione?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Oppure <b>mantenere</b> il peso migliorando solamente l'alimentazione e anche lo stato di forma fisica (valido solo se ci alleniamo)?</li></ol>",
    "Seleziona il tuo <strong>stile alimentare</strong>:",
    "Indicami tra i cibi elencati di seguito se sono presenti <b>alimenti che non consumi assolutamente</b> e che quindi non verranno inseriti nel piano. Scrivi gli alimenti che non gradisci nelle relative caselle di risposta sottostanti altrimenti, se gradisci tutto, lascia la casella relativa vuota.<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span><b>Legumi</b>: Ceci, Fagioli, Piselli, Lenticchie.<textarea id='omni_19_1' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_1\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_1"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span><b>Carne rossa</b>: manzo, vitello, maiale sia in versione fettina/bistecca che in versione hamburger.<textarea id='omni_19_2' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_2\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_2"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span><b>Carne bianca</b>: pollo o tacchino sia in versione fettina/bistecca che in versione hamburger.<textarea id='omni_19_3' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_3\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_3"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span><b>Uova</b>: sia in versione intera che soli albumi (in brick o tetrapack).<textarea id='omni_19_4' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_4\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_4"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>5)</span><b>Pesce</b>: sia <u>con lisca</u> (es: Merluzzo, Nasello, Persico, Platessa, Sogliola, Orata, Pesce Spada, Tonno fresco, Branzino, Salmone, Sarde, Alici, Sgombro), sia <u>molluschi</u> (es: Calamari, Polpo, Seppia, Totani) che <u>crostacei</u> (es: Gamberi).<textarea id='omni_19_5' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_5\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_5"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>6)</span><b>Formaggi</b>: sia <u>freschi</u> nella versione light (es: Mozzarella, Stracchino, Ricotta, Feta, Fiocchi di Latte, Philadelphia) che <u>stagionati</u> (es: Parmigiano, Grana, Asiago, Emmenthal, Pecorino). Se non vuoi assolutamente assumere la versione light dei formaggi freschi specificalo. Prenderemo in considerazione anche la versione senza lattosio solo se è necessario.<textarea id='omni_19_6' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_6\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_6"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>7)</span><b>Salumi magri</b>: Bresaola, Fesa di Pollo o Tacchino arrosto, Prosciutto Crudo sgrassato. Riportami eventuali salumi non presenti tra i precedenti di cui non puoi fare assolutamente a meno.<textarea id='omni_19_7' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_7\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_7"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>8)</span><b>Condimento</b>: di base sarà inserito l'olio extravergine d'oliva. Specificami se potrebbe interessarti in alternativa anche l'avocado scrivendo ''si avocado'' oppure ''no avocado''.<textarea id='omni_19_8' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_8\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_8"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>9)</span><b>Verdure</b>: <u>cotte</u> (es: Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini) o <u>crude</u> (es: Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli).<textarea id='omni_19_9' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_9\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_9"] || "") +
      "</textarea></li><li style='margin-bottom: 15px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>10)</span><b>Fonte di carboidrati</b>: pasta, cereale in chicco (es: riso o farro o simili), patate, pane, derivato secco del pane (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut o Riso o Mais, se è necessario utilizzeremo derivati secchi simili ma senza glutine).<textarea id='omni_19_10' rows='2' style='width: 100%; margin-top: 8px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px; outline: none;' onfocus='this.style.border=\"2px solid #000000\"; this.style.boxShadow=\"0 0 0 4px rgba(37, 99, 235, 0.25)\";' onblur='this.style.border=\"2px solid #e5e7eb\"; this.style.boxShadow=\"0 0 0 0 rgba(37, 99, 235, 0)\";' onchange='handleTextareaChange(event, \"omni_19_10\")' placeholder='Scrivi qui la tua risposta...'>" +
      (answers["omni_19_10"] || "") +
      "</textarea></li></ol>",
    "Consumi almeno 3 volte a settimana il <strong>pesce azzurro fresco</strong>? Esempi di pesce azzurro sono: Suri, Sarde, Alici, Sgombro fresco, Pesce Spada, Lanzardo, Tonno fresco, Palamita, Lampuga, Ricciola, Sugarello, Alaccia, Aguglia, Aringa, Tonno Alletterato, Pesce Sciabola, Costardella, Spratto.",
    "<b>Quali pasti</b> principali giornalieri (colazione, pranzo, cena) consumi a <b>casa</b> e quali <b>fuori</b> durante la settimana? Se consumi dei pasti <b>fuori</b>, indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Quante volte</b> a settimana (es: dal Lunedì al Venerdì oppure 2 volte a settimana, ecc.)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span><b>Dove</b> ti appoggi (Mensa, Bar, Gastronomia, Ristorante oppure se ti porti qualcosa da casa)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Prenderesti in considerazione la <b>possibilità di prepararli a casa</b> e portarli con te (nel caso in cui non lo facessi già)? Oppure preferiresti <b>ricevere degli orientamenti</b> per la gestione del pasto in Mensa/Bar/Gastronomia/Ristorante.</li></ol>",
    "<b>Quanti pasti fai</b> abitualmente ogni giorno (es: solo 2 pasti principali, oppure 3 pasti principali, o 3 pasti principali e 1 o 2 o 3 spuntini)? Indicami anche:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Quali sono</b> esattamente (es: colazione, pranzo, cena, spuntino di metà mattina, spuntino di metà pomeriggio, spuntino dopo cena, ecc.)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Nel caso in cui non ne facessi 5 (colazione, pranzo, cena + 2 spuntini), <b>saresti disposto/a a farne almeno 5</b>?</li></ol>",
    "Riguardo alla tipologia di <b>colazione</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Preferisci consumare una <b>colazione dolce</b> e una <b>salata</b> oppure solo opzioni dolci o solo salate?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Scrivimi, se esistono, anche <b>eventuali necessità personali particolari</b> per la colazione (es: un alimento che non può mancare, un abbinamento di cui non puoi fare a meno, ecc.).</li></ol>",
    "Scrivi <strong>2 tipologie di colazioni</strong> che consumi più di frequente:",
    "In merito al <b>caffè</b>, se lo consumi, indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Quanti caffè</b> consumi durante la giornata?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Sono <b>amari o dolcificati</b> con zucchero o con dolcificanti acalorici (tipo DIETIC classico o Stevia o Eritritolo)?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Nel caso dolcificassi il caffè abitualmente con lo zucchero ma ti proponessi di utilizzare in <b>alternativa dolcificanti acalorici naturali</b> come la Stevia o l'Eritritolo (rispetto alla Stevia non conferisce retrogusto), potremmo inserirli?</li></ol>",
    "Se consumi <b>spuntini</b> durante il giorno allora indicami:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span><b>Cosa</b> ti capita di consumare abitualmente?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Scrivimi, se esistono, anche <b>eventuali necessità personali particolari</b> per gli spuntini (es: un alimento che non può mancare, spuntini pratici da consumare fuori casa, ecc.)</li></ol>",
    "Riguardo al <b>pranzo</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>1)</span>Solitamente consumi un <b>primo</b> piatto (a base di pasta o riso) o un <b>secondo</b> piatto (pietanza) o fai <b>entrambi</b> nello stesso pasto?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>2)</span>Indicami anche se per te è molto importante chiudere il pranzo con la <b>frutta fresca</b> o se ne potresti fare anche a meno.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px;'><span style='margin-right: 5px;'>3)</span>Scrivimi, se esistono, <b>eventuali necessità personali particolari</b> per il pranzo.</li></ol>",
    "Indicami se per <b>pranzo</b> prenderesti in considerazione la possibilità di consumare un <b>piatto unico</b> (insalata di cereale o patate) composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Cereale</b> integrale in chicco (es: Riso o simile) <b>o patate</b> comuni (o Americane)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pietanza.</b> Intendo per esempio: Fiocchi di Latte magri, Feta Light, Petto di Pollo o Tacchino, Piselli, Uova Intere (o solo Albumi), Tonno (specificami se lo preferisci all'olio o al naturale o entrambi), Merluzzo, Nasello, Platessa, Salmone affettato affumicato.</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>porzione di <b>Verdura</b> cotta o cruda da consumare in maniera dissociata dal piatto unico oppure da spezzettare ed includere nel piatto unico.</li></ol>",
    "Indicami se per <b>pranzo</b> prenderesti in considerazione il consumo di un pasto a base di <b>Legumi</b> composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Legumi</b> da consumare <b>in zuppa o asciutti o in vellutata</b></li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pane</b> tostato o derivato secco (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut, pane o derivato senza glutine se è necessario)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>porzione di <b>Verdura</b> cotta (Minestrone o verdure a gradimento) o cruda.</li></ol>",
    "Indicami se per <b>pranzo</b> prenderesti in considerazione il consumo di un pasto a base di <b>Pasta</b>, composto da:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span><b>Pasta</b> di Semola o integrale. Specificami anche se prenderesti in considerazione la pasta a base di <b>farina 100% Legumi come alternativa</b>.</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span>un <b>Condimento semplice</b> (sugo di pomodoro, pesto alla genovese, minestrone, verdure intere saltate in padella o in crema)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>eventuale <b>Pietanza</b></li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='4'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>4)</span>porzione di <b>Verdura</b> cotta o cruda. Riportami anche, se esistono, eventuali necessità personali particolari in merito all'utilizzo di pasta.</li></ol>",
    "Per la <b>cena</b> le indicazioni saranno di abbinare (secondo ben precise frequenze di assunzione settimanale così come da linee guida dettate dalla dieta mediterranea):<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>1)</span>una <b>Pietanza</b> (es: carne rossa, carne bianca, uova, formaggi, salumi magri, pesce)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='2'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>2)</span><b>Pane</b> o patate o derivato secco (es: Crostini integrali Buitoni, fette WASA Integrali, Gallette di Farro o Kamut, pane o derivato senza glutine se è necessario)</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='3'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>3)</span>porzione di <b>Verdura</b> cruda o cotta</li></ol><div style='text-align: center; margin: 10px 0;'>+</div><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;' start='4'><li style='margin-bottom: 5px; text-align: center;'><span style='margin-right: 5px;'>4)</span>porzione di <b>Frutta fresca</b> a fine pasto. Riportami anche, se esistono, eventuali necessità personali particolari per questo pasto.</li></ol>",
    "Riguardo agli <b>alcolici</b>:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span>Bevi <b>alcolici</b>?</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span>Se si allora specificami se li bevi <b>quotidianamente o solo il fine settimana</b>.</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span>Indicami la <b>quantità consumata</b> di vino (in bicchieri) o di birra (specificami quante birre piccole o grandi) o di drink (in bicchieri).</li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span>Nel caso in cui il consumo di alcol sia quotidiano, specificami se potresti <b>farne completamente a meno</b> o se saresti disponibile a <b>ridurlo</b>.</li></ol>",
    'In questa prima fase il <strong>pasto libero sarà 1 a settimana</strong> all\'interno della giornata che più preferirai sfruttare per farlo. Al pasto libero si è "liberi" di consumare tutto ciò che desideriamo (pizza, sushi, carbonara, ecc.). Scrivimi, se esistono, eventuali necessità personali particolari per questo pasto altrimenti scrivi "ok".',
    "Riportami di seguito i dati utili all'<b>emissione della fattura</b> che ti invierò una volta che sarà pronto il piano alimentare. I dati da riportare sono i seguenti:<br><ol style='list-style-type: none; padding-left: 20px; margin-top: 10px;'><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>1)</span><b>Luogo di nascita</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>2)</span><b>Via di residenza</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>3)</span><b>Numero civico</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>4)</span><b>CAP</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>5)</span><b>Città</b></li><li style='margin-bottom: 5px; text-indent: -20px; padding-left: 20px; text-align: left;'><span style='margin-right: 5px;'>6)</span><b>Codice fiscale</b>.</li></ol>",
    'Con riferimento alla Legge 31/12/1996 "tutela delle persone e di altri soggetti al <strong>trattamento dei dati personali</strong>", il sottoscritto (ossia il richiedente la consulenza) spuntando la casella "Autorizzo" ed inviando il questionario esprime il proprio consenso ed autorizza il Dr. Bernardo Giammetta al trattamento dei dati personali limitatamente ai fini di dietoterapia. Prende atto inoltre che i propri dati personali possono essere inseriti in un archivio cartaceo o elettronico.',
  ];

  const progress = ((currentQuestion + 1) / getTotalQuestions()) * 100;
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {currentQuestion === -1 ? (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
                Premessa
              </h1>
            </div>
            <p className="text-lg text-gray-900 text-justify mt-16 mb-16">
              Le domande che seguiranno sono utili a raccogliere solo alcune
              delle informazioni importanti richieste per effettuare la
              consulenza e dunque verranno approfondite, integrate e affiancate
              da altre informazioni che verranno raccolte al momento della
              visita.
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  localStorage.setItem("currentQuestion", "0");
                }}
                className="w-32 bg-blue-600 hover:bg-blue-700"
              >
                Inizia
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
                Questionario 1° Visita
              </h1>
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                {getSubtitle(currentQuestion + 1)}
              </h2>
              <Progress value={progress} className="w-full h-2 mb-2" />
              <div className="text-sm text-gray-500">
                Domanda {getDisplayQuestionNumber()} di {getTotalQuestions()}
              </div>
            </div>

            <div className="mb-6">
              <h2
                className="text-lg font-medium text-gray-900 mb-4 text-justify"
                dangerouslySetInnerHTML={{
                  __html: getQuestionText(getCurrentQuestion()),
                }}
              />
              {currentQuestion === 17 ? ( // Indice 17 per la domanda 18 (gli indici partono da 0)
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={(value) => {
                    const newAnswers = { ...answers, [currentQuestion]: value };
                    // Cancella le risposte alle domande successive
                    for (
                      let i = currentQuestion + 1;
                      i < getTotalQuestions();
                      i++
                    ) {
                      delete newAnswers[i];
                    }
                    // Cancella le risposte della domanda 19 per entrambi gli stili
                    for (let i = 1; i <= 10; i++) {
                      delete newAnswers[`omni_19_${i}`];
                    }
                    for (let i = 1; i <= 6; i++) {
                      delete newAnswers[`veg_19_${i}`];
                    }
                    localStorage.setItem(
                      "questionnaire_answers",
                      JSON.stringify(newAnswers)
                    );
                    setAnswers(newAnswers);
                  }}
                  className="space-y-0"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem
                      value="onnivoro"
                      id="onnivoro"
                      className="mt-1.5"
                    />
                    <Label
                      htmlFor="onnivoro"
                      className="text-lg font-medium text-gray-900 mb-4 text-justify"
                    >
                      <i>
                        <b>Onnivoro</b>
                      </i>{" "}
                      (mangi qualsiasi pietanza di origine animale oppure mangi
                      qualsiasi pietanza di origine animale escludendo solo la
                      carne o il pesce o i formaggi)
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem
                      value="vegetariano"
                      id="vegetariano"
                      className="mt-1.5"
                    />
                    <Label
                      htmlFor="vegetariano"
                      className="text-lg font-medium text-gray-900 mb-4"
                    >
                      <i>
                        <b>Vegetariano</b>
                      </i>{" "}
                      (escludi carne e pesce ma includi latte e derivati e uova)
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem
                      value="vegano"
                      id="vegano"
                      className="mt-1.5"
                    />
                    <Label
                      htmlFor="vegano"
                      className="text-lg font-medium text-gray-900 mb-4"
                    >
                      <i>
                        <b>Vegano</b>
                      </i>{" "}
                      (escludi qualsiasi pietanza di origine animale)
                    </Label>
                  </div>
                </RadioGroup>
              ) : currentQuestion === getTotalQuestions() - 1 ? ( // Usiamo getTotalQuestions invece di questions.length
                <div className="flex items-center space-x-3 justify-center mt-16 mb-16">
                  <input
                    type="checkbox"
                    checked={answers[currentQuestion] || false}
                    onChange={(e) => {
                      const newAnswers = {
                        ...answers,
                        [currentQuestion]: e.target.checked,
                      };
                      localStorage.setItem(
                        "questionnaire_answers",
                        JSON.stringify(newAnswers)
                      );
                      setAnswers(newAnswers);
                    }}
                    className="w-5 h-5 border-2 rounded cursor-pointer"
                  />
                  <span className="text-base font-medium text-gray-900">
                    Autorizzo
                  </span>
                </div>
              ) : currentQuestion === 18 &&
                (answers[17] === "onnivoro" ||
                  answers[17] === "vegetariano" ||
                  answers[17] === "vegano") ? null : (
                <Textarea
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleTextareaChange(e, currentQuestion)}
                  rows={6}
                  className="w-full text-gray-900 text-lg text-justify"
                  placeholder="Scrivi qui la tua risposta..."
                />
              )}
            </div>

            <div className="flex justify-between gap-4">
              <Button
                onClick={() => {
                  const newQuestion = currentQuestion - 1;
                  localStorage.setItem(
                    "currentQuestion",
                    newQuestion.toString()
                  );
                  setCurrentQuestion(newQuestion);
                }}
                variant="outline"
                className="w-32 bg-gray-800 text-white hover:bg-gray-900 border-gray-800"
              >
                Indietro
              </Button>
              {currentQuestion === 0 && <div className="w-32"></div>}
              {currentQuestion === getTotalQuestions() - 1 ? (
                <Button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => setIsSubmitting(false), 1000);
                  }}
                  disabled={isSubmitting || !hasAnswer()}
                  className={`w-48 ${
                    hasAnswer()
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300"
                  }`}
                >
                  {isSubmitting ? "Invio in corso..." : "Invia Questionario"}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const nextQuestion = currentQuestion + 1;
                    if (
                      (answers[17] === "vegetariano" ||
                        answers[17] === "vegano") &&
                      nextQuestion >= getTotalQuestions()
                    ) {
                      return; // Non permettiamo di superare il limite
                    }
                    const newQuestion = Math.min(
                      getTotalQuestions() - 1,
                      nextQuestion
                    );
                    localStorage.setItem("currentQuestion", newQuestion);
                    setCurrentQuestion(newQuestion);
                  }}
                  disabled={!hasAnswer()}
                  className={`w-32 ${
                    hasAnswer()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500"
                  }`}
                >
                  Avanti
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
