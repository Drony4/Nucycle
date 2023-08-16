//К полям с обязательным заполнением добавить класс "._req" (required - требуемое) в <input>

"use strict";

//проверка, на то, что документ уже загружен
document.addEventListener("DOMContentLoaded", function () {
  //Перехватываем отправку формы, чтоб взять все в свои руки
  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", formSend);
  }

  async function formSend(e) {
    e.preventDefault();
    let error = formValidate(form); //предварительная валидация формы
    let formData = new FormData(form); //получаем данные полей формы
    if (error === 0) {
      form.classList.add("_sending");

      //пробуем выполнить запрос, если сервер не отвечает, тогда сработает catch
      try {
        const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
        const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";

        // let response = false; //для хостингов без php чтоб не ругался валидатор
        // let response = await fetch(formAction, {
        //   method: formMethod,
        //   body: formData,
        // });
        let response = { ok: false };

        if (response.ok) {
          let result = await response.json(); // получаем ответ
          alert(result.message); // выводим ответ сервера пользователю
          formPreview ? (formPreview.innerHTML = "") : null; //чистим форму после отправки (превью изображения)
          form.reset(); //чистим форму после отправки
          form.classList.remove("_sending"); //убираем покрывало
        } else {
          // запрос был выполнен, но ответ сервера был не успешен
          alert(
            "Something was wrong while sending form. Mayby server is not avalable.The request was executed, but the server response was not successful."
          );
          form.classList.remove("_sending");
        }
      } catch (error) {
        // возможные ошибки при выполнении запроса
        alert("An error occurred while sending the form: " + error.message);
        form.classList.remove("_sending");
      }
    } else {
      // если не прошло валидацию
      alert("Please fill in the required fields");
    }
  }
  //функция валидации
  function formValidate(form) {
    let error = 0; //изначальное значение
    let formReq = document.querySelectorAll("._req"); //(required - требуемое) этот клас добавить к полям с обязательным заполнением
    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input); //изначально перед каждой проверкой убираем класс "error"
      //проверка E-mail
      if (input.classList.contains("_email")) {
        if (emailTestFail(input) && input.value !== "") {
          formAddTypeError(input); // поле заполнено, но неправильно
          formAddError(input); // элемент не прошел валидацию вообще
          error++; //увеличиваем значение переменной error (0+1)
        } else if (emailTestFail(input) && input.value === "") {
          formAddError(input);
          error++; //увеличиваем значение переменной error (0+1)
        }
      } else if (
        //проверка чекбокса
        input.getAttribute("type") === "checkbox" &&
        input.checked === false
      ) {
        formAddError(input);
        error++; //увеличиваем значение переменной error (0+1)
      } else {
        //проверка заполнено ли поле
        if (input.value === "") {
          formAddError(input);
          error++; //увеличиваем значение переменной error (0+1)
        }
      }
    }
    return error;
  }

  //---------------------------    вспомогательные функции  ------------------------------------
  // если какоето поле не прошло валидацию в общем (не заполнено)
  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  // если поле заполнено, но неправильно
  function formAddTypeError(input) {
    input.parentElement.classList.add("_type-error");
    input.classList.add("_type-error");
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
    input.parentElement.classList.remove("_type-error");
    input.classList.remove("_type-error");
  }
  //Функция теста E-mail (true если не пройден)
  function emailTestFail(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
});
