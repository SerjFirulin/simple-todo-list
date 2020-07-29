class Api::V1::TodoListsController < ApplicationController

  before_action :set_todo_list, only: [:show, :edit, :update, :destroy]

  def index
    @todo_lists = current_user.todo_lists.all
  end

  def show
    if authorized?
      respond_to do |format|
        format.json { render :show }
      end
    else
      handle_unauthorized
    end
  end

  def create
    @todo_list = current_user.todo_lists.build(todo_list_params)
    if authorized?
      respond_to do |format|
        if @todo_list.save
          format.json { render :show, status: :created, location: api_v1_todo_list_path(@todo_list) }
        else
          format.json { render json: @todo_list.errors, status: :unprocessable_entity }
        end
      end
    else
      handle_unauthorized
    end
  end

  def update
    if authorized?
      respond_to do |format|
        if @todo_list.update(todo_list_params)
          format.json { render :show, status: :ok, location: api_v1_todo_list_path(@todo_list) }
        else
          format.json { render json: @todo_list.errors, status: :unprocessable_entity }
        end
      end
    else
      handle_unauthorized
    end
  end

  def destroy
    if authorized?
      @todo_list.destroy
      respond_to do |format|
        format.json { head :no_content }
      end
    else
      handle_unauthorized
    end
  end

  private

  def set_todo_list
    @todo_list = TodoList.find(params[:id])
  end

  def todo_list_params
    params.require(:todo_list).permit(:title, :complete)
  end

  def authorized?
    @todo_list.user == current_user
  end

  def handle_unauthorized
    unless authorized?
      respond_to do |format|
        format.json { render :unauthorized, status: 401 }
      end
    end
  end
end
