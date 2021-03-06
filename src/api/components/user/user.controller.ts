import { BadRequestException } from "../../../exceptions/BadRequestException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { DBFindAllResponse } from "../../../utils/db-find-all-response";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import * as userDAO from "./user.dao";
import { User } from "./user.model";

export const findAll = async (): Promise<DBFindAllResponse<User[]>> => {
    return await userDAO.findAll();
};

export const create = async (dto: CreateUserDTO): Promise<User> => {
    const userWithSameEmail = await userDAO.findByEmail(dto.email);

    if (userWithSameEmail)
        throw new BadRequestException("User with email already exists");

    return await userDAO.create(dto);
};

export const findByID = async (id: number): Promise<User> => {
    const user = await userDAO.findByID(id);

    if (!user) throw new NotFoundException("User does not exist");

    return user;
}

export const update = async (id: number, dto: UpdateUserDTO): Promise<User> => {
    if (dto.email) {
        const userWithSameEmail = await userDAO.findByEmail(dto.email);

        if (userWithSameEmail && id !== userWithSameEmail.id)
            throw new BadRequestException("User with email already exists");
    }

    return await userDAO.update(id, dto);
};

export const remove = async (id: number): Promise<void> => {
    const user = await userDAO.findByID(id);

    if (!user) throw new NotFoundException("User does not exist");

    userDAO.remove(id);
};