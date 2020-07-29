Rails.application.routes.draw do
  devise_for :users

  root 'application#index'

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :todo_lists, only: [:index, :show, :create, :update, :destroy]
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
