$(document).ready(function() {

    var $price;
    var $systemCommission;
    var $systemPaymentCommission;
    var $deliveryPrice;
    var $partnerDeliveryPrice;
    var $partnerAssemblyPrice;
    var $partnerDisAssemblyPrice;
    var $shopDeposit;

    var $shopDepositPaymentCommissionValue = 0;

    var $buyerFinalPrice = 0;
    var $deliveryFinalPrice = 0;
    var $assemblyFinalPrice = 0;
    var $basePrice = 0;
    var $basePriceWithAssemply = 0;
    var $systemCommissionValue = 0;

    var $shopDepositResp = "-";
    var $shopDepositReceiver = "-";
    var $shopDepositSum = 0;

    var $systemCommissionResp = "-";
    var $systemCommissionReceiver = "-";
    var $systemCommissionSum = 0;

    var $deliveryResp = "-";
    var $deliveryReceiver = "-";
    var $deliverySum = 0;

    var $pickupResp = "-";
    var $pickupReceiver = "-";
    var $pickupSum = 0;

    var $assemblyResp = "-";
    var $assemblyReceiver = "-";
    var $assemblySum = 0;

    var $disAssemblyResp = "-";
    var $disAssemblyReceiver = "-";
    var $disAssemblySum = 0;

    var $dropOffResp = "-";
    var $dropOffReceiver = "-";
    var $dropOffSum = 0;

    var $backDeliveryResp = "-";
    var $backDeliveryReceiver = "-";
    var $backDeliverySum = 0;

    var $deliveryBuyerDeposit = 0;
    var $pickupBuyerDeposit = 0
    var $assemblyBuyerDeposit = 0;
    var $disAssemblyBuyerDeposit = 0;
    var $dropOffBuyerDeposit = 0;
    var $backDeliveryBuyerDeposit = 0;
    var $buyerShopDeposit = 0;
    var $buyerSystemCommission = 0;
    var $buyerDepositTotal = 0;

    var $deliverySellerDeposit = 0;
    var $pickupSellerDeposit = 0
    var $assemblySellerDeposit = 0;
    var $sellerDepositTotal = 0;
    var $sellerSystemCommission = 0;

    var $buyerMinus = 0;
    var $sellerMinus = 0;

    var $buyerPlus = 0;
    var $sellerPlus = 0;

    var $shopIncome = 0;
    var $systemIncome = 0;
    var $partnerIncome = 0;

    var $responsibleTexts = {
        seller: "Продавец",
        buyer: "Покупатель",
        "-": "-",
    };

    var $merchantTexts = {
        shop: "Магазин",
        partner: "Партнер",
        system: "Маркетплейс",
        "-": "-"
    };

    var $decisionDescriptions = {
        A0: "Неверный выбор",
        A70: "Возврат оформляется в отделении партнером (недостаточная комплектация, выявленные при осмотре дефекты и т.д.). Считаем техническим возвратом. Сюда же включаем случай, когда посылку никто не забрал. Тут все риски на продавце.",
        A71: "Партнер после сборки или во время сборки обнаруживает проблемы или недостачу комплектации. Считаем техническим возвратом. Все риски на продавце",
        A72: "Покупатель принимает решение о техническом возврате. Арбитром выступает партнер. Если он согласен, что отказ технический - финансовые обязательства на продавце. Если не согласен (отказ не технический) - финансовые обязательства на покупателе",
        A73: "Покупатель принимает решение об отказе (товар не понравился). Ответственность на покупателе. Сюда же относим вариант, когда за велосипедом никто не пришел. Нам нужно ограничить срок, через сколько это решение принимает партнер, чтобы списать деньги за сборку в его пользу с депозита покупателя, который не пришел за товаром",
        A74: "Завершение сделки",
        A75: "Покупатель отказывается от покупки на месте (любая причина)",
        A76: "Завершение сделки на месте",
        A77: "Возврат оформляется в отделении покупателем (недостаточная комплектация, выявленные при осмотре дефекты и т.д.). Считаем техническим возвратом. Сюда же включаем случай, когда посылку никто не забрал. Тут все риски на продавце."
    };

    var $decisionRegistrations = {
        A0: "Неверный выбор",
        A79: "Продавец переводит статус заказа в 'Выполнен'",
        A80: "Продавец переводит статус заказа в 'Отказ'",
        A81: "API службы доставки",
        A82: "Партнер регистрирует технический возврат в системе (например, через telegram бота, отправив специальное сообщение с номером заказа).",
        A83: "Партнер регистрирует отказ пользователя от покупки (например, через telegram бота, отправив специальное сообщение с номером заказа).",
        A84: "Партнер регистрирует завершение сделки (например, через telegram бота, отправив специальное сообщение с номером заказа).",
    };

    var $offlineDealDescriptions = {
        A0: "-",
        A10: "Покупатель рассчитывается с продавцом на месте удобным для обеих сторон способом",
        A11: "Покупатель рассчитывается в отделении службы доставки за товар (наложенный платеж)",
        A12: "Покупатель рассчитывается в отделении службы доставки за доставку и товар (наложенный платеж)",
        A13: "Покупатель рассчитывается с продавцом (перевод на карту). Продавец подтверждает покупку в системе. Партнер получает уведомление и отдает заказ.",
        A14: "Покупатель рассчитывается на точке партнера удобным для обеих сторон способом",

    };

    var $adPriceTexts = {
        onePrice: "Цена",
        splitPrice: "Цена (самовывоз)"
    };

    var $agreementTypeDescriptions = {
        none: "",
        partial: "По этому договору магазин обязуется оплатить работу точек сборки по его заказам и все комиссии маркета в конце месяца через выставление счета (без необходимости платить депозит при подтверждении каждого заказа). Партнерские точки в свою очередь продают товары магазина и тоже рассчитываются с магазином по договору",
        full: "По этому договору, помимо всех гарантий простого договора, добавляется гарантия оплаты работы точки партнера в случае отказа или если заказ не забрали. В этом случае для покупателя максимально упрощается процедура (без депозита)",
        partner: "Тоже самое что и полная интеграция, только гарантии на стороне маркетплейса"
    };

    $(".trigger").change(function() {
        main();
    });

    function main() {
        init();
        refresh();
        calcPrices();
        calcDeposits();
        renderDecisionDescription();
        renderDecisionRegistration();
        defineResponsibility();
        calcDepositOperations();
        calcIncomes();
        calcOfflineDeal();
    }

    function init() {

        $price = parseFloat($("#price").val());
        $systemCommission = parseFloat($("#systemCommission").val());
        $systemPaymentCommission = parseFloat($("#systemPaymentCommission").val());
        $deliveryPrice = parseFloat($("#deliveryPrice").val());
        $partnerDeliveryPrice = parseFloat($("#partnerDeliveryPrice").val());
        $partnerAssemblyPrice = parseFloat($("#partnerAssemblyPrice").val());
        $partnerDisAssemblyPrice = parseFloat($("#partnerDisAssemblyPrice").val());
        $shopDeposit = parseFloat($("#shopDeposit").val());

        $buyerFinalPrice = 0;
        $deliveryFinalPrice = 0;
        $assemblyFinalPrice = 0;
        $basePrice = 0;
        $basePriceWithAssemply = 0;
        $systemCommissionValue = 0;

        $shopDepositResp = "-";
        $shopDepositReceiver = "-";
        $shopDepositSum = 0;

        $systemCommissionResp = "-";
        $systemCommissionReceiver = "-";
        $systemCommissionSum = 0;

        $deliveryResp = "-";
        $deliveryReceiver = "-";
        $deliverySum = 0;

        $pickupResp = "-";
        $pickupReceiver = "-";
        $pickupSum = 0;

        $assemblyResp = "-";
        $assemblyReceiver = "-";
        $assemblySum = 0;

        $disAssemblyResp = "-";
        $disAssemblyReceiver = "-";
        $disAssemblySum = 0;

        $dropOffResp = "-";
        $dropOffReceiver = "-";
        $dropOffSum = 0;

        $backDeliveryResp = "-";
        $backDeliveryReceiver = "-";
        $backDeliverySum = 0;

        $deliveryBuyerDeposit = 0;
        $pickupBuyerDeposit = 0
        $assemblyBuyerDeposit = 0;
        $disAssemblyBuyerDeposit = 0;
        $dropOffBuyerDeposit = 0;
        $backDeliveryBuyerDeposit = 0;
        $buyerShopDeposit = 0;
        $buyerSystemCommission = 0;
        $buyerDepositTotal = 0;

        $deliverySellerDeposit = 0;
        $pickupSellerDeposit = 0
        $assemblySellerDeposit = 0;
        $sellerDepositTotal = 0;
        $sellerSystemCommission = 0;

        $buyerMinus = 0;
        $sellerMinus = 0;

        $buyerPlus = 0;
        $sellerPlus = 0;

        $shopIncome = 0;
        $systemIncome = 0;
        $partnerIncome = 0;

    };

    function refresh() {

        if ($("#sellerType").val() == "shop") {
            $("#merchantSettingBlock").show();
        } else {
            $("#merchantSettingBlock").hide();
            $("#pickupPointAgreementType").val("none");
        }

        $("#buyerDelivery_selfPickup").hide();
        $("#buyerDelivery_deliveryService").hide();
        $("#buyerDelivery_partnerPickupPoint").hide();

        $("#sellerDisAssemblyIncludedBlock").hide();
        $("#sellerDeliveryIncludedBlock").hide();
        $("#sellerAssemblyIncludedBlock").hide();

        if ($("#sellerSelfPickup").is(":checked")) {
            $("#buyerDelivery_selfPickup").show();
        }

        if ($("#sellerDelivery").is(":checked")) {
            $("#buyerDelivery_deliveryService").show();
            $("#sellerDisAssemblyIncludedBlock").show();
            $("#sellerDeliveryIncludedBlock").show();
        }

        if ($("#sellerPickupPoint").is(":checked")) {
            $("#buyerDelivery_partnerPickupPoint").show();
            $("#sellerDisAssemblyIncludedBlock").show();
            $("#sellerAssemblyIncludedBlock").show();
        }

        if ($("#buyerDelivery_"+$("#buyerDelivery").val()).css("display")=='none') {
            $("#buyerDelivery").val("none");
        }

        if ($("#buyerDelivery").val() == "selfPickup") {
            $("#decisionOnSelfPickupCard").show();
            $("#decisionOnDeliveryCard").hide();
            $("#decisionOnDeliverySelfPickupCard").hide();
            //$("#pickupPointBlock").hide();
            //$("#pickupPointAgreementBlock").hide();
            $("#deliverSettingBlock").hide();
            $("#partnerSettingBlock").hide();
        } else {
            $("#decisionOnSelfPickupCard").hide();
            //if ($("#buyerPickupPoint").val() == "selected") {
            if ($("#buyerDelivery").val() == "partnerPickupPoint") {
                $("#decisionOnDeliveryCard").show();
                $("#decisionOnDeliverySelfPickupCard").hide();
                if ($("#sellerType").val() == "shop") {
                    //$("#pickupPointAgreementBlock").show();
                    //if ($("#pickupPointAgreement").is(":checked")) {
                        $("#pickupPointAgreementTypeBlock").show();
                        $("#pickupPointAgreementTypeText").html($agreementTypeDescriptions[$("#pickupPointAgreementType").val()])
                    //} else {
                    //    $("#pickupPointAgreementTypeBlock").hide();
                    //}
                } else {
                    //$("#pickupPointAgreement").prop( "checked", false);
                    //$("#pickupPointAgreementBlock").hide();
                }
                $("#partnerSettingBlock").show();
            } else {
                $("#decisionOnDeliverySelfPickupCard").show();
                $("#decisionOnDeliveryCard").hide();
                //$("#pickupPointAgreement").prop( "checked", false);
                //$("#pickupPointAgreementBlock").hide();
                $("#partnerSettingBlock").hide();
            }
            //$("#pickupPointBlock").show();
            $("#deliverSettingBlock").show();
        }

        if ($("#sellerDisAssemblyIncluded").is(":checked")) {
            $("#sellerAssemblyPriceBlock").hide();
        } else {
            $("#sellerAssemblyPriceBlock").show();
        }

    }

    function calcPrices() {

        // цена объявления

        // базовая цена
        $basePrice = $price;

        var $adPrice = $basePrice;
        var $adPriceWithDisAssambly = $basePrice;

        if (!$("#sellerDisAssemblyIncluded").is(":checked")) {
            $adPriceWithDisAssambly += parseFloat($("#sellerAssemblyPrice").val());
        }


        $systemCommissionValue = addPaymentCommission(($basePrice * $systemCommission) / 100);

        $adPrice += $systemCommissionValue;
        $adPriceWithDisAssambly += $systemCommissionValue;

        //$adPrice = addPaymentCommission($adPrice); //($adPrice * $systemPaymentCommission) / 100;

       // $adPriceWithDisAssambly += ($adPrice * $systemCommission) / 100;
        //$adPriceWithDisAssambly = addPaymentCommission($adPriceWithDisAssambly); // ($adPrice * $systemPaymentCommission) / 100;

        if (!$("#sellerDisAssemblyIncluded").is(":checked")) {
            $("#adPriceLabel").html($adPriceTexts["splitPrice"]);
            $("#adPriceWithDisAssamblyBlock").show();
            $("#adPrice").html($adPrice.toFixed(2));
            $("#adPriceWithDisAssambly").html($adPriceWithDisAssambly.toFixed(2));
        } else {
            $("#adPriceLabel").html($adPriceTexts["onePrice"]);
            $("#adPriceWithDisAssamblyBlock").hide();
            $("#adPrice").html($adPrice.toFixed(2));
        }

        // цены, которые видит покупатель перед оформлением заказа

        $buyerFinalPrice = $basePrice + $systemCommissionValue;

        if ($("#sellerType").val()=="shop") {

            var $buyerShopDepositWithoutPaymentCommission = 0;

            if ($("#depositType").val()=="percent") {
                $buyerShopDepositWithoutPaymentCommission = ($basePrice*$shopDeposit)/100;
            } else {
                $buyerShopDepositWithoutPaymentCommission = $shopDeposit;
            }
            $buyerShopDeposit = addPaymentCommission($buyerShopDepositWithoutPaymentCommission);

            $shopDepositPaymentCommissionValue = ($buyerShopDeposit - $buyerShopDepositWithoutPaymentCommission);

            $buyerFinalPrice += $shopDepositPaymentCommissionValue;

            $adPriceWithDisAssambly += $shopDepositPaymentCommissionValue;

        }

        if ($("#buyerDelivery").val() == "deliveryService") {

            if (!$("#sellerDeliveryIncluded").is(":checked")) {
                $deliveryFinalPrice = $deliveryPrice;
            }

            if (!$("#sellerDisAssemblyIncluded").is(":checked")) {
                $buyerFinalPrice = $adPriceWithDisAssambly;
            }

        }

        if ($("#buyerDelivery").val() == "partnerPickupPoint") {

            if (!$("#sellerDisAssemblyIncluded").is(":checked")) {
                $buyerFinalPrice = $adPriceWithDisAssambly;
            }

            if (!$("#sellerAssemblyIncluded").is(":checked")) {
                $assemblyFinalPrice = $partnerDeliveryPrice + $partnerAssemblyPrice;
            }

        }


        // if ($("#buyerDelivery").val() == "deliveryService") {
        //
        //     if (!$("#sellerDisAssemblyIncluded").is(":checked")) {
        //         $buyerFinalPrice = $adPriceWithDisAssambly;
        //     }
        //
        //     if (!$("#sellerDeliveryIncluded").is(":checked")) {
        //         $deliveryFinalPrice = $deliveryPrice;
        //     }
        //
        //     if ($("#buyerPickupPoint").val() == "selected") {
        //
        //         if (!$("#sellerAssemblyIncluded").is(":checked")) {
        //             $assemblyFinalPrice = $partnerDeliveryPrice + $partnerAssemblyPrice;
        //         }
        //
        //     }
        //
        // }

        $("#buyerFinalPrice").html($buyerFinalPrice.toFixed(2));

        $("#deliveryFinalPrice").html($deliveryFinalPrice.toFixed(2));

        $("#assemblyFinalPrice").html($assemblyFinalPrice.toFixed(2));

    }

    function calcDeposits() {

        // === ПРОДАВЕЦ ===

        // Комиссия маркетплейса
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()=="none"
        ) {
            $sellerSystemCommission = $systemCommissionValue;
        }

        // Пересылка службой доставки
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            !$("#sellerDeliveryIncluded").is(":checked") &&
            $("#pickupPointAgreementType").val()=="none"
        ) {
            $deliverySellerDeposit = $deliveryPrice;
            //$deliverySellerDeposit += ($deliverySellerDeposit*$systemPaymentCommission/100);
            $deliverySellerDeposit = addPaymentCommission($deliverySellerDeposit);
        }

        // Получение партнером в отделении службы доставки
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()=="none"
        ) {
            $pickupSellerDeposit = $partnerDeliveryPrice;
            //$pickupSellerDeposit += ($pickupSellerDeposit*$systemPaymentCommission/100);
            $pickupSellerDeposit = addPaymentCommission($pickupSellerDeposit);
        }

        // Сборка велосипеда партнером
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()=="none"
        ) {
            $assemblySellerDeposit = $partnerAssemblyPrice;
            //$assemblySellerDeposit += ($assemblySellerDeposit*$systemPaymentCommission/100);
            $assemblySellerDeposit = addPaymentCommission($assemblySellerDeposit);
        }

        // Итого

        $sellerDepositTotal = $sellerSystemCommission + $deliverySellerDeposit + $pickupSellerDeposit + $assemblySellerDeposit;

        $("#sellerSystemCommission").html($sellerSystemCommission.toFixed(2));
        $("#deliverySellerDeposit").html($deliverySellerDeposit.toFixed(2));
        $("#pickupSellerDeposit").html($pickupSellerDeposit.toFixed(2));
        $("#assemblySellerDeposit").html($assemblySellerDeposit.toFixed(2));
        $("#sellerDepositTotal").html($sellerDepositTotal.toFixed(2));


        // === ПОКУПАТЕЛЬ ===

        // Комиссия маркетплейса
        if (
            $("#buyerDelivery").val()!="partnerPickupPoint"
        ) {
            $buyerSystemCommission = $systemCommissionValue;
        }

        // Пересылка службой доставки
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            !$("#sellerDeliveryIncluded").is(":checked") &&
            !(
                $("#pickupPointAgreement").is(":checked") &&
                ($("#pickupPointAgreementType").val() == "full" || $("#pickupPointAgreementType").val() == "partner")
            )
        ) {
            $deliveryBuyerDeposit = $deliveryPrice;
            //$deliveryBuyerDeposit += ($deliveryBuyerDeposit*$systemPaymentCommission/100);
            $deliveryBuyerDeposit = addPaymentCommission($deliveryBuyerDeposit);
        }

        // Получение партнером в отделении службы доставки
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()!="full" &&
            $("#pickupPointAgreementType").val()!="partner"
        ) {
            $pickupBuyerDeposit = $partnerDeliveryPrice;
            //$pickupBuyerDeposit += ($pickupBuyerDeposit*$systemPaymentCommission/100);
            $pickupBuyerDeposit = addPaymentCommission($pickupBuyerDeposit);
        }

        // Сборка велосипеда партнером
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()!="full" &&
            $("#pickupPointAgreementType").val()!="partner"
        ) {
            $assemblyBuyerDeposit = $partnerAssemblyPrice;
            //$assemblyBuyerDeposit += ($assemblyBuyerDeposit*$systemPaymentCommission/100);
            $assemblyBuyerDeposit = addPaymentCommission($assemblyBuyerDeposit);
        }

        // Возврат: Подготовка партнером к обратной отправке
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()!="full" &&
            $("#pickupPointAgreementType").val()!="partner"
        ) {
            $disAssemblyBuyerDeposit = $partnerDisAssemblyPrice;
            //$disAssemblyBuyerDeposit += ($disAssemblyBuyerDeposit*$systemPaymentCommission/100);
            $disAssemblyBuyerDeposit = addPaymentCommission($disAssemblyBuyerDeposit);
        }

        // Возврат: Доставка партнером в почтовое отделение и отправка
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()!="full" &&
            $("#pickupPointAgreementType").val()!="partner"
        ) {
            $dropOffBuyerDeposit = $partnerDeliveryPrice;
            //$dropOffBuyerDeposit += ($dropOffBuyerDeposit*$systemPaymentCommission/100);
            $dropOffBuyerDeposit = addPaymentCommission($dropOffBuyerDeposit);
        }

        // Возврат: Пересылка службой доставки
        if (
            $("#buyerDelivery").val()=="partnerPickupPoint" &&
            $("#pickupPointAgreementType").val()!="full" &&
            $("#pickupPointAgreementType").val()!="partner"
        ) {
            $backDeliveryBuyerDeposit = $deliveryPrice;
            //$backDeliveryBuyerDeposit += ($backDeliveryBuyerDeposit*$systemPaymentCommission/100);
            $backDeliveryBuyerDeposit = addPaymentCommission($backDeliveryBuyerDeposit);
        }

        // Задаток за товар

        /*

        if ($("#sellerType").val()=="shop") {

            if ($("#depositType").val()=="percent") {
                $buyerShopDeposit = ($basePrice*$shopDeposit)/100;
            } else {
                $buyerShopDeposit = $shopDeposit;
            }
            //$buyerShopDeposit += ($buyerShopDeposit*$systemPaymentCommission/100);
            $buyerShopDeposit = addPaymentCommission($buyerShopDeposit);
        }

        */

        //$buyerSystemCommission += ($buyerSystemCommission*$systemPaymentCommission/100);

        // Итого

        $buyerDepositTotal = $deliveryBuyerDeposit +
            $pickupBuyerDeposit +
            $assemblyBuyerDeposit +
            $disAssemblyBuyerDeposit +
            $dropOffBuyerDeposit +
            $backDeliveryBuyerDeposit +
            $buyerShopDeposit +
            $buyerSystemCommission;

        $("#buyerShopDeposit").html($buyerShopDeposit.toFixed(2));
        $("#buyerSystemCommission").html($buyerSystemCommission.toFixed(2));
        $("#deliveryBuyerDeposit").html($deliveryBuyerDeposit.toFixed(2));
        $("#pickupBuyerDeposit").html($pickupBuyerDeposit.toFixed(2));
        $("#assemblyBuyerDeposit").html($assemblyBuyerDeposit.toFixed(2));
        $("#disAssemblyBuyerDeposit").html($disAssemblyBuyerDeposit.toFixed(2));
        $("#dropOffBuyerDeposit").html($dropOffBuyerDeposit.toFixed(2));
        $("#backDeliveryBuyerDeposit").html($backDeliveryBuyerDeposit.toFixed(2));
        $("#buyerDepositTotal").html($buyerDepositTotal.toFixed(2));

    }

    function renderDecisionDescription() {

        var $decisionIndex = "A0";

        if ($("#buyerDelivery").val() == "selfPickup") {
            if ($("#decisionOnSelfPickUp").val() == "return") {
                $decisionIndex = "A75";
            } else if ($("#decisionOnSelfPickUp").val() == "buy") {
                $decisionIndex = "A76";
            }
        }
        else if ($("#buyerDelivery").val() == "deliveryService") {
            if ($("#decisionOnDeliverySelfPickup").val() == "buy") {
                $decisionIndex = "A74";
            } else if ($("#decisionOnDeliverySelfPickup").val() == "returnOnDelivery") {
                $decisionIndex = "A77";
            }
        }
        else if ($("#buyerDelivery").val() == "partnerPickupPoint") {
            if ($("#decisionOnDelivery").val() == "buy") {
                $decisionIndex = "A74";
            } else if ($("#decisionOnDelivery").val() == "returnOnDelivery") {
                $decisionIndex = "A70";
            } else if ($("#decisionOnDelivery").val() == "returnAfterAssemble") {
                $decisionIndex = "A71";
            } else if ($("#decisionOnDelivery").val() == "technicalReturn") {
                $decisionIndex = "A72";
            } else if ($("#decisionOnDelivery").val() == "basicReturn") {
                $decisionIndex = "A73";
            }
        }

        $("#decisionDescription").html($decisionDescriptions[$decisionIndex]);

    }

    function renderDecisionRegistration() {

        var $registrationIndex = "A0";

        if ($("#buyerDelivery").val() == "selfPickup") {
            if ($("#decisionOnSelfPickUp").val() == "return") {
                $registrationIndex = "A80";
            } else if ($("#decisionOnSelfPickUp").val() == "buy") {
                $registrationIndex = "A79";
            }
        }
        else if ($("#buyerDelivery").val() == "deliveryService") {
            if ($("#decisionOnDeliverySelfPickup").val() == "buy") {
                $registrationIndex = "A81";
            } else if ($("#decisionOnDeliverySelfPickup").val() == "returnOnDelivery") {
                $registrationIndex = "A81";
            }

        }
        else if ($("#buyerDelivery").val() == "partnerPickupPoint") {
            if ($("#decisionOnDelivery").val() == "buy") {
                $registrationIndex = "A84";
            } else if ($("#decisionOnDelivery").val() == "returnOnDelivery") {
                $registrationIndex = "A81";
            } else if ($("#decisionOnDelivery").val() == "returnAfterAssemble") {
                $registrationIndex = "A82";
            } else if ($("#decisionOnDelivery").val() == "technicalReturn") {
                $registrationIndex = "A82";
            } else if ($("#decisionOnDelivery").val() == "basicReturn") {
                $registrationIndex = "A83";
            }
        }

        $("#decisionRegistration").html($decisionRegistrations[$registrationIndex]);

    }

    function defineResponsibility() {

        // Ответственность за залог

        if ($("#sellerType").val()=="shop") {
            if (
                ($("#buyerDelivery").val() == "partnerPickupPoint" && $("#decisionOnDelivery").val() == "buy")
                ||
                ($("#buyerDelivery").val() == "deliveryService" && $("#decisionOnDeliverySelfPickup").val() == "buy")
                ||
                ($("#buyerDelivery").val() == "selfPickup" && $("#decisionOnSelfPickUp").val() == "buy")
            ) {
                if ($buyerShopDeposit) {
                    $shopDepositResp = "buyer";
                    $shopDepositReceiver = "shop";
                }
            }
        }

        // Ответственность за комиссию маркета

        if (
            //($("#buyerDelivery").val() == "partnerPickupPoint" && $("#decisionOnDelivery").val() == "buy")
            //||
            ($("#buyerDelivery").val() == "deliveryService" && $("#decisionOnDeliverySelfPickup").val() == "buy")
            ||
            ($("#buyerDelivery").val() == "selfPickup" && $("#decisionOnSelfPickUp").val() == "buy")
        ) {
            if ($buyerSystemCommission) {
                $systemCommissionResp = "buyer";
                $systemCommissionReceiver = "system"
            }
        }

        if ($("#buyerDelivery").val() == "partnerPickupPoint" && $("#decisionOnDelivery").val() == "buy") {
            if ($sellerSystemCommission) {
                $systemCommissionResp = "seller";
                $systemCommissionReceiver = "system"
            }
        }

        // Ответственность за пересылку службой доставки

        if ($("#buyerDelivery").val() == "partnerPickupPoint") {
            if (!$("#sellerDeliveryIncluded").is(":checked")) {
                if ($("#decisionOnDelivery").val()=="buy" || $("#decisionOnDelivery").val()=="basicReturn") {
                    if ($deliveryBuyerDeposit) {
                        $deliveryResp = "buyer";
                        $deliveryReceiver = "partner";
                    }
                } else {
                    if ($deliverySellerDeposit) {
                        $deliveryResp = "seller";
                        $deliveryReceiver = "partner";
                    }
                }
            }
        }

        // Ответственность за получение партнером в почтовом отделении

        if ($("#buyerDelivery").val() == "partnerPickupPoint") {

            if (
                $("#decisionOnDelivery").val() == "returnOnDelivery"
                ||
                $("#decisionOnDelivery").val() == "returnAfterAssemble"
                ||
                $("#decisionOnDelivery").val() == "technicalReturn"
                ||
                (
                    $("#decisionOnDelivery").val() == "buy"
                    &&
                    $("#sellerAssemblyIncluded").is(":checked")
                )
            ) {
                if ($pickupSellerDeposit) {
                    $pickupResp = "seller";
                    $pickupReceiver = "partner";
                }
            }
            else if (
                $("#decisionOnDelivery").val() == "basicReturn"
                ||
                (
                    $("#decisionOnDelivery").val() == "buy"
                    &&
                    !$("#sellerAssemblyIncluded").is(":checked")
                )
            ) {
                if ($pickupBuyerDeposit) {
                    $pickupResp = "buyer";
                    $pickupReceiver = "partner";
                }
            }

        }

        // Ответственность за сборку велосипеда партнером

        if ($("#buyerDelivery").val() == "partnerPickupPoint") {

            if (
                $("#decisionOnDelivery").val() == "returnAfterAssemble"
                ||
                $("#decisionOnDelivery").val() == "technicalReturn"
                ||
                (
                    $("#decisionOnDelivery").val() == "buy"
                    &&
                    $("#sellerAssemblyIncluded").is(":checked")
                )
            ) {
                if ($assemblySellerDeposit) {
                    $assemblyResp = "seller";
                    $assemblyReceiver = "partner";
                }
            }
            else if (
                $("#decisionOnDelivery").val() == "basicReturn"
                ||
                (
                    $("#decisionOnDelivery").val() == "buy"
                    &&
                    !$("#sellerAssemblyIncluded").is(":checked")
                )
            ) {
                if ($assemblyBuyerDeposit) {
                    $assemblyResp = "buyer";
                    $assemblyReceiver = "partner";
                }
            }

        }

        // Ответственность за возврат (обратная подготовка, доставка в отделение службы доставки и пересылка)

        if ($("#buyerDelivery").val() == "partnerPickupPoint") {
            if ($("#decisionOnDelivery").val() == "basicReturn") {
                if ($disAssemblyBuyerDeposit) {
                    $disAssemblyResp = "buyer";
                    $disAssemblyReceiver = "partner";
                }
                if ($dropOffBuyerDeposit) {
                    $dropOffResp = "buyer";
                    $dropOffReceiver = "partner";
                }
                if ($backDeliveryBuyerDeposit) {
                    $backDeliveryResp = "buyer";
                    $backDeliveryReceiver = "partner";
                }
            }
        }

        $shopDepositSum = ($shopDepositResp === "buyer" ? $buyerShopDeposit : 0);
        $systemCommissionSum = ($systemCommissionResp === "buyer" ? $buyerSystemCommission : ($systemCommissionResp === "seller" ? $sellerSystemCommission : 0));
        $deliverySum = ($deliveryResp === "buyer" ? $deliveryBuyerDeposit : ($deliveryResp === "seller" ? $deliverySellerDeposit : 0));
        $pickupSum = ($pickupResp === "buyer" ? $pickupBuyerDeposit : ($pickupResp === "seller" ? $pickupSellerDeposit : 0));
        $assemblySum = ($assemblyResp === "buyer" ? $assemblyBuyerDeposit : ($assemblyResp === "seller" ? $assemblySellerDeposit : 0));
        $disAssemblySum = ($disAssemblyResp === "buyer" ? $disAssemblyBuyerDeposit : 0);
        $dropOffSum = ($dropOffResp === "buyer" ? $dropOffBuyerDeposit : 0);
        $backDeliverySum =($backDeliveryResp === "buyer" ? $backDeliveryBuyerDeposit : 0);

        $("#shopDepositResp").html($responsibleTexts[$shopDepositResp])
        $("#shopDepositReceiver").html($merchantTexts[$shopDepositReceiver])
        $("#shopDepositSum").html($shopDepositSum.toFixed(2));

        $("#systemCommissionResp").html($responsibleTexts[$systemCommissionResp])
        $("#systemCommissionReceiver").html($merchantTexts[$systemCommissionReceiver])
        $("#systemCommissionSum").html($systemCommissionSum.toFixed(2));

        $("#deliveryResp").html($responsibleTexts[$deliveryResp])
        $("#deliveryReceiver").html($merchantTexts[$deliveryReceiver])
        $("#deliverySum").html($deliverySum.toFixed(2));

        $("#pickupResp").html($responsibleTexts[$pickupResp])
        $("#pickupReceiver").html($merchantTexts[$pickupReceiver])
        $("#pickupSum").html($pickupSum.toFixed(2));

        $("#assemblyResp").html($responsibleTexts[$assemblyResp])
        $("#assemblyReceiver").html($merchantTexts[$assemblyReceiver])
        $("#assemblySum").html($assemblySum.toFixed(2));

        $("#disAssemblyResp").html($responsibleTexts[$disAssemblyResp])
        $("#disAssemblyReceiver").html($merchantTexts[$disAssemblyReceiver])
        $("#disAssemblySum").html($disAssemblySum.toFixed(2));

        $("#dropOffResp").html($responsibleTexts[$dropOffResp])
        $("#dropOffReceiver").html($merchantTexts[$dropOffReceiver])
        $("#dropOffSum").html($dropOffSum.toFixed(2));

        $("#backDeliveryResp").html($responsibleTexts[$backDeliveryResp])
        $("#backDeliveryReceiver").html($merchantTexts[$backDeliveryReceiver])
        $("#backDeliverySum").html($backDeliverySum.toFixed(2));

    }

    function calcDepositOperations() {

        $buyerMinus = 0;
        $sellerMinus = 0;
        $buyerPlus = 0;
        $sellerPlus = 0;

        if ($shopDepositResp==="buyer") $buyerMinus += $shopDepositSum;
        if ($systemCommissionResp==="buyer") $buyerMinus += $systemCommissionSum;
        if ($deliveryResp==="buyer") $buyerMinus += $deliverySum;
        if ($pickupResp==="buyer") $buyerMinus += $pickupSum;
        if ($assemblyResp==="buyer") $buyerMinus += $assemblySum;
        if ($disAssemblyResp==="buyer") $buyerMinus += $disAssemblySum;
        if ($dropOffResp==="buyer") $buyerMinus += $dropOffSum;
        if ($backDeliveryResp==="buyer") $buyerMinus += $backDeliverySum;

        if ($shopDepositResp==="seller") $sellerMinus += $shopDepositSum;
        if ($systemCommissionResp==="seller") $sellerMinus += $systemCommissionSum;
        if ($deliveryResp==="seller") $sellerMinus += $deliverySum;
        if ($pickupResp==="seller") $sellerMinus += $pickupSum;
        if ($assemblyResp==="seller") $sellerMinus += $assemblySum;
        if ($disAssemblyResp==="seller") $sellerMinus += $disAssemblySum;
        if ($dropOffResp==="seller") $sellerMinus += $dropOffSum;
        if ($backDeliveryResp==="seller") $sellerMinus += $backDeliverySum;

        $buyerPlus = $buyerDepositTotal - $buyerMinus;
        $sellerPlus = $sellerDepositTotal - $sellerMinus;

        $("#buyerMinus").html($buyerMinus.toFixed(2));
        $("#sellerMinus").html($sellerMinus.toFixed(2));

        $("#buyerPlus").html($buyerPlus.toFixed(2));
        $("#sellerPlus").html($sellerPlus.toFixed(2));

    }

    function calcIncomes() {

        $shopIncome = 0;
        $systemIncome = 0
        $partnerIncome = 0;

        if ($shopDepositReceiver==="shop") $shopIncome = $shopDepositSum;
        if ($systemCommissionReceiver==="system") $systemIncome = $systemCommissionSum;

        if ($deliveryReceiver==="partner") $partnerIncome += $deliverySum;
        if ($pickupReceiver==="partner") $partnerIncome += $pickupSum;
        if ($assemblyReceiver==="partner") $partnerIncome += $assemblySum;
        if ($disAssemblyReceiver==="partner") $partnerIncome += $disAssemblySum;
        if ($dropOffReceiver==="partner") $partnerIncome += $dropOffSum;
        if ($backDeliveryReceiver==="partner") $partnerIncome += $backDeliverySum;

        $shopIncome = subPaymentCommission($shopIncome);
        $systemIncome = subPaymentCommission($systemIncome);
        $partnerIncome = subPaymentCommission($partnerIncome);

        $("#shopIncome").html($shopIncome.toFixed(2));
        $("#systemIncome").html($systemIncome.toFixed(2));
        $("#partnerIncome").html($partnerIncome.toFixed(2));

    }

    function calcOfflineDeal() {

        var $offlineDealDescriptionIndex = "A0";
        var $offlineDeal = 0;

        if ($("#buyerDelivery").val()=="selfPickup" && $("#decisionOnSelfPickUp").val()=="buy") {
            $offlineDealDescriptionIndex = "A10";
            $offlineDeal = $buyerFinalPrice - $buyerMinus;
        } else if ($("#buyerDelivery").val()=="deliveryService" && $("#decisionOnDeliverySelfPickup").val()=="buy") {
            if ($("#sellerDeliveryIncluded").is(":checked")) {
                $offlineDealDescriptionIndex = "A11";
                $offlineDeal = $buyerFinalPrice - $buyerMinus;
            } else {
                $offlineDealDescriptionIndex = "A12";
                $offlineDeal = $buyerFinalPrice + $deliveryPrice - $buyerMinus;
            }
        } else if ($("#buyerDelivery").val() == "partnerPickupPoint" && $("#decisionOnDelivery").val()=="buy") {
            if ($("#sellerDeliveryIncluded").is(":checked")) {
                if ($("#pickupPointAgreementType").val()=="none") {
                    $offlineDealDescriptionIndex = "A13";
                } else {
                    $offlineDealDescriptionIndex = "A14";
                }
                $offlineDeal = $buyerFinalPrice - $buyerMinus;
            } else {
                if ($("#pickupPointAgreementType").val()=="none") {
                    $offlineDealDescriptionIndex = "A13";
                } else {
                    $offlineDealDescriptionIndex = "A14";
                }
                $offlineDeal = $buyerFinalPrice + $deliveryPrice - $buyerMinus;
            }
        }

        $("#offlineDealDescription").html($offlineDealDescriptions[$offlineDealDescriptionIndex]);
        $("#offlineDeals").html($offlineDeal.toFixed(2));

    }

    function addPaymentCommission($sum) {
        return ($sum*100)/(100 - $systemPaymentCommission);
    }

    function subPaymentCommission($sum) {
        return $sum - ($sum*$systemPaymentCommission)/100;
    }

    main();

});