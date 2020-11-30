import { DBFindAllResponse } from "../../../../utils/db-find-all-response";
import { Filter } from "../../../../utils/filter";
import { ShoppingCartItem } from "./shopping-cart-item.model";
import * as shoppingCartItemDAO from "./shopping-cart-item.dao";
import { NotFoundException } from "../../../../exceptions/NotFoundException";
import { CreateShoppingCartItemDTO } from "./dto/create-shopping-cart-item.dto";
import { DeleteResult } from "typeorm";
import { UpdateShoppingCartItemDTO } from "./dto/update-shopping-cart-item.dto";

export const findAll = async (
    filter: Filter
): Promise<DBFindAllResponse<ShoppingCartItem[]>> => {
    return await shoppingCartItemDAO.findAll(filter);
};

export const findByID = async (id: number): Promise<ShoppingCartItem> => {
    const item = await shoppingCartItemDAO.findByID(id);

    if (!item) throw new NotFoundException("Item does not exist");

    return item;
};

export const create = async (
    dto: CreateShoppingCartItemDTO
): Promise<ShoppingCartItem> => {
    return await shoppingCartItemDAO.create(dto);
};

export const update = async (
    id: number,
    dto: UpdateShoppingCartItemDTO
): Promise<ShoppingCartItem> => {
    return await shoppingCartItemDAO.update(id, dto);
};

export const remove = async (id: number): Promise<DeleteResult> => {
    return await shoppingCartItemDAO.remove(id);
};
